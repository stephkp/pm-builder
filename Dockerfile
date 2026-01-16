# Base image
FROM ruby:2.7.8

# Install system dependencies
RUN apt-get update -qq && \
    apt-get install -y \
    curl \
    postgresql-client \
    && rm -rf /var/lib/apt/lists/*

# Install Node.js 20.x and Yarn
RUN curl -fsSL https://deb.nodesource.com/setup_20.x | bash - && \
    curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | apt-key add - && \
    echo "deb https://dl.yarnpkg.com/debian/ stable main" | tee /etc/apt/sources.list.d/yarn.list && \
    apt-get update && \
    apt-get install -y nodejs yarn

# Set working directory
WORKDIR /app

# Install specific bundler version
RUN gem install bundler -v 2.3.26

# Copy only the files needed for installing gems
COPY Gemfile* ./

# Install gems
RUN bundle _2.3.26_ install --jobs 4 --retry 3

# Copy the rest of the application
COPY . /app/

# Create necessary directories
RUN mkdir -p tmp/pids

# Add a script to be executed every time the container starts
COPY bin/entrypoint.sh /usr/bin/
RUN chmod +x /usr/bin/entrypoint.sh

# Precompile bootsnap code for faster boot times
RUN bundle exec bootsnap precompile --gemfile app/ lib/

# Set the entrypoint script
ENTRYPOINT ["entrypoint.sh"]
EXPOSE 3000

# Start the main process
CMD ["rails", "server", "-b", "0.0.0.0"]