class SessionController < ApplicationController

  # Create a session, with a newly generated access token
  def create
    if params[:code]
      body = {
        "client_id" => APP_CONFIG['oauth2']['client_id'],
        "client_secret" => APP_CONFIG['oauth2']['client_secret'],
        "code" => params[:code]
      }
      token_uri = URI(APP_CONFIG['oauth2']['token_endpoint'])
      if APP_CONFIG['oauth2']['provider'] == 'gu'
        authenticate_by_gu(body, token_uri)
      elsif APP_CONFIG['oauth2']['provider'] == 'github'
        authenticate_by_github(body, token_uri)
      else
        render json: {error: {msg: "Unknown OAuth2 provider"}}, status: 400
      end
    else
      render json: {error: {msg: "Missing 'code' parameter"}}, status: 400
    end
  end

  def show
    token = params[:id]
    token_object = AccessToken.find_by_token(token)
    if token_object && token_object.validated?
      render json: token_response(token_object.user, token_object.token)
    else
      render json: {error: { code: "SESSION_ERROR", msg: "Invalid session"}}, status: 401
    end
  end

  private

  def authenticate_by_gu(body, token_uri)
    additional_body = {
      "grant_type" => "authorization_code",
      "redirect_uri" => "https://" + APP_CONFIG['frontend_hostname'] + "/torii/redirect.html"
    }
    body = body.merge(additional_body)
    http = Net::HTTP.new(token_uri.host, token_uri.port)
    http.use_ssl = true
    request = Net::HTTP::Post.new(token_uri.request_uri)
    request['Content-Type'] = 'application/x-www-form-urlencoded'
    request.set_form_data(body)
    response = http.request(request)

    case response
    when Net::HTTPSuccess then
      begin
        json_response = JSON.parse(response.body)
      rescue JSON::ParserError
        render json: {error: {msg: "Invalid JSON response"}}, status: 401
        return
      end
      if json_response["id_token"]
        token = json_response["id_token"]
        begin
          # Handle token as a JWT, decode it and extract the username
          decoded_token = JWT.decode(token, nil, false)
          username = decoded_token.first["account"]
          if account_allowed(username)
            user = User.find_by_username(username)
            if !user
              user = User.new(username: username, role: "USER")
            end
            token_object = AccessToken.generate_token(user)
            render json: token_response(user, token_object.token)
          else
            error = "Account not allowed"
            render json: {error: {code: "AUTH_ERROR", msg: error}}, status: 403
          end
        rescue JWT::DecodeError
          render json: {error: {code: "AUTH_ERROR", msg: "Invalid token"}}, status: 401
        end
      else
        error = json_response["error"] ? json_response["error"] : "Unknown GU ADFS error"
        render json: {error: { code: "AUTH_ERROR", msg: error}}, status: 401
      end
    else
      error = "Missing parameters"
      render json: {error: { code: "AUTH_ERROR", msg: error}}, status: 401
    end
  end

  def authenticate_by_github(body, token_uri)
    response = Net::HTTP.post(
      token_uri,
      body.to_json,
      'Content-type' => 'application/json',
      'Accept' => 'application/json'
    )
    case response
    when Net::HTTPSuccess then
      begin
        json_response = JSON.parse(response.body)
      rescue JSON::ParserError
        render json: {error: {msg: "Invalid JSON response"}}, status: 401
        return
      end
      if json_response["access_token"]
        token = json_response["access_token"]
        uri = URI(APP_CONFIG['oauth2']['user_endpoint'])
        response = Net::HTTP.start(uri.hostname, uri.port, :use_ssl => true) {|http|
          request = Net::HTTP::Get.new(uri)
          request['Accept'] = 'application/vnd.github+json'
          request['Authorization'] = "Bearer #{token}"
          request['X-GitHub-Api-Version'] = '2022-11-28'
          response = http.request(request)
          response
        }
        case response
          when Net::HTTPSuccess then
            begin
              json_response = JSON.parse(response.body)
            rescue JSON::ParserError
              render json: {error: {msg: "Invalid JSON response"}}, status: 401
              return
            end
            if json_response["login"]
            username = json_response["login"]
            if account_allowed(username)
              user = User.find_by_username(username)
              if !user
                user = User.new(username: username, role: "USER")
              
                user.role = "ADMIN" if ENV['DEV_OVERRIDE_ADMIN'] && username == ENV['DEV_OVERRIDE_ADMIN']
              end
              token_object = AccessToken.generate_token(user)
              render json: token_response(user, token_object.token)
            else
              error = "Account not allowed"
              render json: {error: { code: "AUTH_ERROR", msg: error}}, status: 403
            end
          else
            error = "Invalid user data from Github"
            render json: {error: { code: "AUTH_ERROR", msg: error}}, status: 401
          end
        else
          error = "Error getting user from Github: " + response.message
          render json: {error: { code: "AUTH_ERROR", msg: error}}, status: 401
        end
      else
        error = json_response["error"] ? json_response["error"] : "Unknown Github error"
        render json: {error: { code: "AUTH_ERROR", msg: error}}, status: 401
      end
    else
      error = "Missing parameters"
      render json: {error: { code: "AUTH_ERROR", msg: error}}, status: 401
    end
  end

  def token_response(user, token)
    @response = {}
    @response[:user] = user.as_json
    @response[:user][:role] = user.role_data
    @response[:access_token] = token
    @response[:token_type] = "bearer"
    @response
  end

  def account_allowed username
    return true if ENV['DEV_ALLOW_ALL_ACCOUNTS']
    return true if username[/^x/]
    return false
  end
end
