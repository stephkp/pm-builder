require "test_helper"

class InvestorsControllerTest < ActionDispatch::IntegrationTest
  test "should get new" do
    get investors_new_url
    assert_response :success
  end

  test "should get create" do
    get investors_create_url
    assert_response :success
  end

  test "should get success" do
    get investors_success_url
    assert_response :success
  end

  test "should get edit" do
    get investors_edit_url
    assert_response :success
  end
end
