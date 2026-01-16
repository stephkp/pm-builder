class HealthController < ApplicationController
  skip_before_action :verify_authenticity_token

  def index
    head :ok
  end
end