require "json"

module ApplicationHelper

  def vite_react_tags
    if Rails.env.development?
      dev_server = ENV.fetch("FRONTEND_URL", "http://localhost:5173")

      react_refresh_preamble = tag.script(type: "module") do
        <<~JS.html_safe
          import RefreshRuntime from "#{dev_server}/@react-refresh"
          RefreshRuntime.injectIntoGlobalHook(window)
          window.$RefreshReg$ = () => {}
          window.$RefreshSig$ = () => (type) => type
          window.__vite_plugin_react_preamble_installed__ = true
        JS
      end

      safe_join(
        [
          react_refresh_preamble,
          tag.script(type: "module", src: "#{dev_server}/@vite/client"),
          tag.script(type: "module", src: "#{dev_server}/src/main.jsx")
        ],
        "\n"
      )
    else
      manifest_path = Rails.root.join("public", "vite", "manifest.json")
      manifest = JSON.parse(File.read(manifest_path))

      entry = manifest["src/main.jsx"] || manifest["main"] || manifest.values.find { |v| v["isEntry"] }
      raise "Vite manifest entrypoint not found" unless entry

      tags = []
      Array(entry["css"]).each do |css|
        tags << stylesheet_link_tag("/vite/#{css}", media: "all")
      end
      tags << tag.script(type: "module", src: "/vite/#{entry.fetch("file")}")

      safe_join(tags, "\n")
    end
  end
end
