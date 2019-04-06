import React, { Component } from "react";
import axios from "axios";
import "./App.css";
var validUrl = require("valid-url");

class App extends Component {
  state = { url: "", tabUrl: [], originalUrl: "" };

  handleChange = event => {
    const name = event.target.name;
    const value = event.target.value;
    this.setState({ [name]: value });
  };

  handleSubmit = async event => {
    event.preventDefault();
    try {
      if (validUrl.isUri(this.state.url)) {
        const response = await axios.get(
          "http://localhost:5500/creat_url?url=" + this.state.url
        );
        console.log(response.data);
        if (response.data.message === "Created okay") {
          this.setState({ url: "" });
          this.getAllurl();
        }
      } else {
        alert("Format url incorrect");
        //this.setState({ url: "" });
      }
    } catch (error) {
      this.setState({
        error: true
      });
    }
  };

  getAllurl = async () => {
    try {
      const response = await axios.get("http://localhost:5500/all_url");

      // Va déclencher un nouveau render
      this.setState({
        tabUrl: response.data
      });
      //console.log(response.data);
    } catch (error) {
      this.setState({
        error: true
      });
    }
  };

  getOGurl = async url => {
    try {
      const response = await axios.get(
        "http://localhost:5500/found_url?url=" + url
      );

      // Va déclencher un nouveau render
      console.log(response.data);
      // this.setState({ originalUrl: response.data });
      window.open(response.data, "_blank");
      this.getAllurl();
    } catch (error) {
      this.setState({
        error: true
      });
    }
  };

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <p>Simplify your links</p>
          <from>
            <input
              type="text"
              name="url"
              placeholder="Your original URL here"
              value={this.state.url}
              onChange={this.handleChange}
            />
            <button className="urlButton" onClick={this.handleSubmit}>
              SHORTEN URL
            </button>
          </from>
        </header>
        <body>
          <div className="tab">
            <div className="col1">Original URL</div>
            <div className="col2">Short URL</div>
            <div className="col3">Visits</div>
          </div>
          <div className="tab2">
            {this.state.tabUrl.map((url, index) => {
              if (this.state.tabUrl.length > 0) {
                return (
                  <div className="tableau" key={index}>
                    <a href={url.ogUrl} className="og">
                      {url.ogUrl}
                    </a>
                    <p
                      className="nw"
                      onClick={() => {
                        this.getOGurl(url.shUrl);
                      }}
                    >
                      {url.shUrl}
                    </p>
                    <div className="visite">{url.visit}</div>
                  </div>
                );
              }
            })}
          </div>
        </body>
      </div>
    );
  }
  async componentDidMount() {
    this.getAllurl();
  }
}

export default App;
