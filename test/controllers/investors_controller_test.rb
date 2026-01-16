require "test_helper"

class InvestorsControllerTest < ActionDispatch::IntegrationTest
  def valid_investor_params
    {
      first_name: "John",
      last_name: "Doe",
      date_of_birth: "1990-01-01",
      phone_number: "1234567890",
      street_address: "123 Main St",
      city: "New York",
      state: "NY",
      zip_code: "10001",
      ssn: "123-45-6789"
    }
  end

  test "should get new" do
    get new_investor_url
    assert_response :success
  end

  test "should get success" do
    get success_investors_url
    assert_response :success
  end

  test "should get edit" do
    investor = Investor.create!(valid_investor_params.merge(
      documents: [fixture_file_upload('test.txt', 'text/plain')]
    ))
    get edit_investor_url(investor)
    assert_response :success
  end

  test "should create investor" do
    assert_difference('Investor.count') do
      post investors_url, params: {
        investor: valid_investor_params.merge(
          documents: [fixture_file_upload('test.txt', 'text/plain')]
        )
      }
    end
    assert_response :redirect
  end
end
