class Investor < ApplicationRecord
  has_many_attached :documents

  before_validation :normalize_ssn
  
  # Validations
  validates :first_name, :last_name, :date_of_birth, :phone_number, 
            :street_address, :city, :state, :zip_code, presence: true
  validates :zip_code, format: { with: /\A\d{5}(-\d{4})?\z/, message: "should be in the format 12345 or 12345-6789" }
  validates :state, inclusion: { in: %w[AL AK AZ AR CA CO CT DE FL GA HI ID IL IN IA KS KY LA ME MD MA MI MN MS MO MT NE NV NH NJ NM NY NC ND OH OK OR PA RI SC SD TN TX UT VT VA WA WV WI WY], 
                                message: "is not a valid US state code" }
  validate :validate_documents_present

  validates :ssn, presence: true,
                  format: { with: /\A\d{3}-\d{2}-\d{4}\z/, 
                            message: "must be in the format XXX-XX-XXXX" },
                  uniqueness: true

  private

  def validate_documents_present
    errors.add(:documents, "must be attached") unless documents.attached?
  end

  def normalize_ssn
    return if ssn.blank?

    digits = ssn.to_s.gsub(/\D/, '')
    self.ssn = if digits.length == 9
      "#{digits[0, 3]}-#{digits[3, 2]}-#{digits[5, 4]}"
    else
      ssn
    end
  end
end
