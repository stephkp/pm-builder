class InvestorsController < ApplicationController
  def index
  @investors = Investor.all
end

  def new
    @investor = Investor.new
  end

  def create
    @investor = Investor.new(investor_params)

    if @investor.save
      respond_to do |format|
        format.html { redirect_to investors_path, notice: 'Investor information was successfully submitted.' }
        format.json { render json: { investor: { id: @investor.id } }, status: :created }
      end
    else
      respond_to do |format|
        format.html { render :new, status: :unprocessable_entity }
        format.json { render json: { errors: @investor.errors.full_messages }, status: :unprocessable_entity }
      end
    end
  end

  def show
    @investor = Investor.find(params[:id])
  end

  def edit
    @investor = Investor.find(params[:id])
  end

  def update
    @investor = Investor.find(params[:id])
    
    if @investor.update(investor_params)
      respond_to do |format|
        format.html { redirect_to investors_path, notice: 'Investor was successfully updated.' }
        format.json { render json: { investor: { id: @investor.id } }, status: :ok }
      end
    else
      respond_to do |format|
        format.html { render :edit, status: :unprocessable_entity }
        format.json { render json: { errors: @investor.errors.full_messages }, status: :unprocessable_entity }
      end
    end
  end

  def destroy
    @investor = Investor.find(params[:id])
    @investor.destroy

    respond_to do |format|
      format.html { redirect_to investors_path, notice: 'Investor was successfully deleted.' }
      format.json { render json: { ok: true }, status: :ok }
    end
  rescue ActiveRecord::RecordNotFound
    respond_to do |format|
      format.html { redirect_to investors_path, alert: 'Investor not found.' }
      format.json { render json: { error: 'Investor not found.' }, status: :not_found }
    end
  end

  def download
    @investor = Investor.find(params[:id])
    attachment = @investor.documents.find_by(id: params[:document_id])
    
    if attachment
      document = attachment.blob
      send_data document.download,
                filename: document.filename.sanitized,
                type: document.content_type,
                disposition: 'attachment'
    else
      redirect_to @investor, 
                  alert: 'The requested file could not be found or is no longer available.'
    end
  rescue ActiveRecord::RecordNotFound
    redirect_to @investor, 
                status: :not_found,
                alert: 'The requested investor or document could not be found.'
  end

  def destroy_document
    @investor = Investor.find(params[:id])
    attachment = @investor.documents.find_by(id: params[:document_id])

    if attachment
      attachment.purge
      respond_to do |format|
        format.json { render json: { success: true } }
        format.html { redirect_to edit_investor_path(@investor), notice: 'Document was successfully deleted.' }
      end
    else
      respond_to do |format|
        format.json { render json: { error: 'Document not found' }, status: :not_found }
        format.html { redirect_to edit_investor_path(@investor), alert: 'Document not found.' }
      end
    end
  rescue ActiveRecord::RecordNotFound
    respond_to do |format|
      format.json { render json: { error: 'Investor not found' }, status: :not_found }
      format.html { redirect_to investors_path, alert: 'Investor not found.' }
    end
  end

  private

  def investor_params
    params.require(:investor).permit(
      :first_name, 
      :last_name, 
      :date_of_birth, 
      :phone_number, 
      :street_address, 
      :city, 
      :state, 
      :zip_code,
      :ssn,
      documents: []
    )
  end
end
