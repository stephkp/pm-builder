class Investor < ApplicationRecord
  has_many_attached :documents

  before_validation :normalize_ssn
  before_validation :normalize_names
  
  # Validations
  validates :first_name, :last_name, :date_of_birth, :phone_number, 
            :street_address, :city, :state, :zip_code, presence: true
  validates :zip_code, format: { with: /\A\d{5}(-\d{4})?\z/, message: "should be in the format 12345 or 12345-6789" }
  validates :state, inclusion: { in: %w[AL AK AZ AR CA CO CT DE FL GA HI ID IL IN IA KS KY LA ME MD MA MI MN MS MO MT NE NV NH NJ NM NY NC ND OH OK OR PA RI SC SD TN TX UT VT VA WA WV WI WY], 
                                message: "is not a valid US state code" }
  validate :validate_documents_present
  validate :validate_unique_full_name

  validates :ssn, presence: true,
                  format: { with: /\A\d{3}-\d{2}-\d{4}\z/, 
                            message: "must be in the format XXX-XX-XXXX" },
                  uniqueness: true

  private

  def validate_documents_present
    errors.add(:documents, "must be attached") unless documents.attached?
  end

  def validate_unique_full_name
    return if first_name.blank? || last_name.blank?

    existing = Investor
      .where('LOWER(first_name) = ? AND LOWER(last_name) = ?', first_name.downcase, last_name.downcase)

    existing = existing.where.not(id: id) if persisted?

    if existing.exists?
      errors.add(:base, 'An investor with this first and last name already exists')
    end
  end

  def normalize_names
    self.first_name = first_name.to_s.strip.gsub(/\s+/, ' ') if first_name
    self.last_name = last_name.to_s.strip.gsub(/\s+/, ' ') if last_name
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
