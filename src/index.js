import React from 'react';
import ReactDOM from 'react-dom';
import './style.css';

const audioSrc =
"https://raw.githubusercontent.com/freeCodeCamp/cdn/master/build/testable-projects-fcc/audio/BeepSound.wav";

function App(){

    const[displayTime,setDisplayTime]=React.useState(25*60);
    const[breakTime,setBreakTime]=React.useState(5*60);
    const[sessionTime,setSessionTime]=React.useState(25*60)
    const[timerOn,setTimerOn]=React.useState(false);
    const[onBreak,setOnBreak]=React.useState(false);
    const[audioBreak,setAudioBreak]=React.useState(new Audio(audioSrc));
   
    const playBreakSound=()=>{
        audioBreak.currentTime=0;
        audioBreak.play();
    }
    const formatTime=(time)=>{
        let minutes=Math.floor(time/60);
        let seconds=time%60;
        return (
            (minutes<10?"0"+minutes:minutes)+":"+(seconds<10?"0"+seconds:seconds)
        )
    }

    const changeTime=(amount,type)=>{
        if(type==="break"){
            if(breakTime<=60&&amount<0){
                return;
            }
            setBreakTime((prev)=>prev+amount);
        }else{
            if(sessionTime<=60&&amount<0){
                return;
            }
            setSessionTime((prev)=>prev+amount);
            if(!timerOn){
                setDisplayTime(sessionTime+amount)
            }
        }
    }
    const resetTime=()=>{
        if(timerOn){
            clearInterval(localStorage.getItem("interval-id"));
        }
        audioBreak.currentTime=0;
        audioBreak.pause();
        setTimerOn(false);
        setOnBreak(false);
        setDisplayTime(25*60);
        setSessionTime(25*60);
        setBreakTime(5*60);
    }
    const controlTime=()=>{
        let second = 1000;
        let date = new Date().getTime();
        let nextDate = new Date().getTime() + second;
        let onBreakVariable = onBreak;
        if(!timerOn){
            let interval=setInterval(()=>{
                date=new Date().getTime();
                if(date>nextDate){
                    setDisplayTime((prev)=>{
                        if(prev<=0 && !onBreakVariable){
                            playBreakSound();
                            onBreakVariable=true;
                            setOnBreak(true)
                            return breakTime;
                        }
                        if(prev<=0 && onBreakVariable){
                            playBreakSound();
                            onBreakVariable=false;
                            setOnBreak(false)
                            return sessionTime;
                        }
                        return prev - 1;
                    })
                    nextDate+=second;
                }
            },1000);
            localStorage.clear();
            localStorage.setItem("interval-id",interval);
        }
        if(timerOn){
            clearInterval(localStorage.getItem("interval-id"));
        }
        setTimerOn(!timerOn);
    }

    return(
        <div className="container-fluid">
            <div className="text-center">
                <div className="dual-container">
                    <Length
                        title={"Break Length"}
                        id="break-length"
                        changeTime={changeTime}
                        type={"break"}
                        time={breakTime}
                        formatTime={formatTime}
                    />
                    <Length
                        title={"Session Length"}
                        id="session-length"
                        changeTime={changeTime}
                        type={"session"}
                        time={sessionTime}
                        formatTime={formatTime}
                    />
                    
                </div>
                <div id="timer">
                    <h3 id="timer-label">{onBreak?"Break":"Session"}</h3>
                    <h1 id="time-left" className="text-center">{formatTime(displayTime)}</h1>
                    <button id="start_stop" className="btn btn-dark m-1" onClick={controlTime}>
                        {timerOn?(<i className="fas fa-pause-circle fa-2x"></i>):(<i className="fas fa-play-circle fa-2x"></i>)}
                    </button>
                    <button id="reset" className="btn btn-dark m-1" onClick={resetTime}>
                        <i className="fas fa-sync-alt fa-2x"></i>
                    </button>
                </div>
            </div>
        </div>
    );
}

function Length({title,changeTime,type,time,formatTime}){
    return (
        <div>
            <h3 id={type==="break"?"break-label":"session-label"}>{title}</h3>
            <div className="time-sets">
                <button id={type==="break"?"break-decrement":"session-decrement"} className="btn btn-dark" onClick={()=>changeTime(-60,type)}>
                    <i className="fas fa-arrow-circle-down fa-2x"></i>
                </button>
                
                <h3>{formatTime(time)}</h3>
                <button id={type==="break"?"break-increment":"session-increment"} className="btn btn-dark" onClick={()=>changeTime(60,type)}>
                    <i className="fas fa-arrow-circle-up fa-2x"></i>
                </button>
            </div>
        </div>
    )
}

ReactDOM.render(<App/>,document.getElementById("root"));