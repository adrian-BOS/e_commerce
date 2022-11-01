class Api::UsersController < ApplicationController
  # For user signup
  def create
    @user = User.new(user_params)

    if @user.save
      helpers.set_user_session(@user)
    else
      @error_object = @user.errors.messages
    end
  end

  def update
  end

  # For user login
  def authenticate_user
    @user = User.find_by(email: params.dig(:email), password: params.dig(:password))

    if @user.present?
      helpers.set_user_session(@user)
    else
      @error_object = { user: "User not found" }
    end
  end

  private
  def user_params
    params.permit(:first_name, :last_name, :email, :password, :password_confirmation)
  end
end