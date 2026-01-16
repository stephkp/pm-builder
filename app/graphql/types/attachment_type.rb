module Types
  class AttachmentType < Types::BaseObject
    field :id, ID, null: false
    field :filename, String, null: false
    field :content_type, String, null: false
    field :byte_size, Integer, null: false
    field :download_url, String, null: false

    def filename
      object.blob.filename.to_s
    end

    def content_type
      object.blob.content_type.to_s
    end

    def byte_size
      object.blob.byte_size
    end

    def download_url
      Rails.application.routes.url_helpers.rails_blob_path(object, disposition: "inline", only_path: true)
    end
  end
end
