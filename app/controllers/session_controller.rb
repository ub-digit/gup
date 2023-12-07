class SessionController < ApplicationController

  # Create a session, with a newly generated access token
  def create
    if params[:username]
      error = nil
      user = User.find_by_username(params[:username])
      if !user
        user = User.new(username: params[:username], role: "USER")
      end
      token = user.authenticate(params[:password])
      if token
        render json: token_response(user, token)
      else
        render json: {error: { code: "AUTH_ERROR", msg: error}}, status: 401
      end
    elsif params[:code]
      uri = 'https://github.com/login/oauth/access_token'
      body = {
        "client_id" => APP_CONFIG['oauth2']['client_id'],
        "client_secret" => APP_CONFIG['oauth2']['client_secret'],
        "code" => params[:code]
      }

      response = Net::HTTP.post(
        URI(uri),
        body.to_json,
        'Content-type' => 'application/json',
        'Accept' => 'application/json'
      )
      # @TODO: refactor using:
      #case response
      #  when Net::HTTPSuccess then
      #  else
      #end
      # ??

      json_response = JSON.parse(response.body) #if res.is_a?(Net::HTTPSuccess)
      #TODL is_a? instead, or check code, exceptions?
      if json_response["access_token"]
        token = json_response["access_token"]
        uri = URI('https://api.github.com/user')
        response = Net::HTTP.start(uri.hostname, uri.port, :use_ssl => true) {|http|
          request = Net::HTTP::Get.new(uri)
          #/vnd.github?
          request['User-Agent'] = 'GUB-backend'
          request['Accept'] = 'application/vnd.github+json'
          request['Authorization'] = "Bearer #{token}"
          request['X-GitHub-Api-Version'] = '2022-11-28'
          response = http.request(request)
          response
        }

        if response.is_a?(Net::HTTPSuccess)
          json_response = JSON.parse(response.body)
          if json_response["login"]
            username = json_response["login"]
            user = User.find_by_username(username)
            if !user
              user = User.new(username: username, role: "USER")
            end
            token_object = AccessToken.generate_token(user)
            render json: token_response(user, token_object.token)
          else
            error = "Invalid user data"
            render json: {error: { code: "GITHUB_AUTH_ERROR", msg: error}}, status: 401
          end
        else
          error = "Error getting user: " + response.message
          render json: {error: { code: "GITHUB_AUTH_ERROR", msg: error}}, status: 401
        end
      else
        error = json_response["error"] ? json_response["error"] : "Unknown error"
        render json: {error: { code: "GITHUB_AUTH_ERROR", msg: error}}, status: 401
      end
    else
      error = "Missing parameters"
      render json: {error: { code: "AUTH_ERROR", msg: error}}, status: 401
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
    def token_response(user, token)
      @response = {}
      @response[:user] = user.as_json
      @response[:user][:role] = user.role_data
      @response[:access_token] = token
      @response[:token_type] = "bearer"
      @response
    end
end
