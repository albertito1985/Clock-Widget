import {Component} from 'react';
import './App.css';

import './controller/useful';//probar
import {general} from './controller/controller';
import {Disco, Escrito, RelojDigital, RelojAnalogo} from './components/Reloj'
import { toHaveDisplayValue } from '@testing-library/jest-dom/dist/matchers';

class App extends Component {
  constructor(){
    super();
    this.state = {
      hours: 1,
      minutes: 40,
      config:{
        analogInteraction: true,
        analogAnswer:false,
        digitalInteraction:true,
        digitalAnswer:false,
        digital:24,
        writtenType:0,
        writtenAnswer:true,
        writtenInteraction:false
      },
      feedback:"",
      answer:null
    }
    this.changeTime = this.changeTime.bind(this);
    this.updateFeedback = this.updateFeedback.bind(this);
    this.updateResponse = this.updateResponse.bind(this);
  }
  
  componentDidMount(){
    //fetch info from URL
    // this.setState(general.getRandomTime());
  }

  changeTime({hours,minutes}){
    this.setState({
      hours:hours,
      minutes:minutes,
    })
  }

  updateFeedback(timeObject){
    this.setState({feedback: timeObject.feedback})
  }

  parseURLParams(url) {
    var queryStart = url.indexOf("?") + 1,
        queryEnd   = url.indexOf("#") + 1 || url.length + 1,
        query = url.slice(queryStart, queryEnd - 1),
        pairs = query.replace(/\+/g, " ").split("&"),
        parms = {}, i, n, v, nv;

    if (query === url || query === "") return;

    for (i = 0; i < pairs.length; i++) {
        nv = pairs[i].split("=", 2);
        n = decodeURIComponent(nv[0]);
        v = decodeURIComponent(nv[1]);

        if (!parms.hasOwnProperty(n)) parms[n] = [];
        parms[n].push(nv.length === 2 ? v : null);
    }
    return parms;
}
  updateResponse(response){
    console.log({response,state:this.state})
    let stateTime = {
      hours:this.state.hours,
      minutes: this.state.minutes
    }
    if(general.compareTime(stateTime,response.results)){
      //aquí me quedé
      //mostrar la respuesta escrita correctamente si es que está mal escrita.
      // dar feedback el tipo de frase.
      let correctspelling = general.compareSpelling(response);
      if( correctspelling === true){
        this.setState({answer:response,feedback:[<span className="greetings" key={response.analysis.phrase}>{general.randomGreeting()}</span>, ...response.feedback]})
      }else{
        this.setState({answer:response,feedback:[<span className="greetings" key={response.analysis.phrase}>{`${general.randomGreeting()} observa en detalle la escritura correcta; ${correctspelling}`}</span>, ...response.feedback]})
      }
    }else{
      this.setState({feedback:"La hora escrita NO es correcta."})
    }
  }
  render(){
    return (
      <div className="App">
        <div className="container">

          <div className="instructions">
            <h2>Clock Widget</h2>
            <p>Move the clock handles or change the digital time.</p>
          </div>

          <div className="clocks">
            <div className="discoContainer">
              <div className="triangle-down"></div>
              <Disco hours={this.state.hours} minutes={this.state.minutes} period={this.state.period}/>
            </div>
            
            <div className="relojes">
              <RelojAnalogo hours={this.state.hours} minutes={this.state.minutes} answer={this.state.config.analogAnswer} response={this.changeTime} interaction={this.state.config.analogInteraction} feedback={null}/>
              <RelojDigital hours={this.state.hours} minutes={this.state.minutes} answer={this.state.config.digitalAnswer} response={this.changeTime} interaction={this.state.config.digitalInteraction} mode={this.state.config.digital}/>
            </div>
          </div>
          

        </div>
      </div>
    );
  }
}



export default App;
