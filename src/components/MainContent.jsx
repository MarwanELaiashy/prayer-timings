import React, { useEffect, Fragment } from 'react';
import Grid from '@mui/material/Grid';
import { useState } from "react";
import Stack from '@mui/material/Stack';
import axios from "axios";
import Divider from '@mui/material/Divider';
import Prayer from './Prayer';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import moment from "moment";
import "moment/dist/locale/ar";
import "../components/Test.css";
moment.locale("ar");


const MainContent = () => {
    // States
    const[nextPrayerIndex, setNextPrayerIndex] = useState(2);
    const [timings, setTimings] = useState({
        "Fajr": "03:46",
        "Dhuhr": "11:53",
        "Asr": "15:28",
        "Sunset": "18:27",
        "Isha": "19:50"
    });

    const[remainingTime, setRemainingTime] = useState("");

    const [selectedCity, setSelectedCity] = useState({
        displayName: "القاهرة",
        apiName:"Cairo"
    });

    const [today, setToday] = useState("");

    const availableCities = [
        {
            displayName: "القاهرة",
            apiName: "Cairo"
        },
        {
            displayName: "طنطا",
            apiName: "Tanta"
        },
        {
            displayName: "الأسكندرية",
            apiName: "Alexandria"
        },
        {
            displayName:"السويس",
            apiName:"Suez"
        },
        {
            displayName: "الجيزة",
            apiName:"Gizeh"
        },
        {
            displayName: "الأقصر",
            apiName: "Luxor"
        },
        {
            displayName: "أسيوط",
            apiName:"Asyut"
        }
    ];

    const prayersArray= [
        {key:"Fajr", displayName:"الفجر"},
        {key:"Dhuhr", displayName:"الظهر"},
        {key:"Asr", displayName:"العصر"},
        {key:"Sunset", displayName:"المغرب"},
        {key:"Isha", displayName:"العشاء"},
    ]


    const getTimings = async () => {
        const response = await axios.get(`https://api.aladhan.com/v1/timingsByCity?country=EG&city=${selectedCity.apiName}`)
        setTimings(response.data.data.timings); 
    }

    useEffect(() => {
        getTimings();
    }, [selectedCity]);

    useEffect(() => {
        let interval = setInterval(() => {
            setupCountdownTimer();
        },1000);

        const t = moment();
        setToday(t.format('MMM Do YYYY | h:mm'));

        return () => {
            clearInterval(interval);
        }
    },[timings]);


const setupCountdownTimer = () => {
    const momentNow = moment();

    let prayerIndex = 2;

    if(momentNow.isAfter(moment(timings["Fajr"], "hh:mm")) && momentNow.isBefore(moment(timings["Dhuhr"], "hh:mm"))) {
        prayerIndex = 1;
    }else if (momentNow.isAfter(moment(timings["Dhuhr"], "hh:mm")) && momentNow.isBefore(moment(timings["Asr"], "hh:mm"))) {
        prayerIndex = 2;
    }else if (momentNow.isAfter(moment(timings["Asr"], "hh:mm")) && momentNow.isBefore(moment(timings["Sunset"], "hh:mm"))) {
        prayerIndex = 3;
    }else if (momentNow.isAfter(moment(timings["Sunset"], "hh:mm")) && momentNow.isBefore(moment(timings["Isha"], "hh:mm"))) {
        prayerIndex = 4;
    }else {
        prayerIndex = 0;
    }

    setNextPrayerIndex(prayerIndex);

    const nextPrayerObject = prayersArray[prayerIndex];
    const nextPrayerTime = timings[nextPrayerObject.key];
    const nextPrayerTimeMoment = moment(nextPrayerTime, "hh:mm");

    let remainingTime = nextPrayerTimeMoment.diff(momentNow); 

    if(remainingTime < 0) {
        const midnightDiff = moment("23:59:59", "hh:mm:ss").diff(momentNow);
        const fajrToMidnightDiff = nextPrayerTimeMoment.diff(moment("00:00:00","hh:mm:ss"));
        const totalDifference =  midnightDiff + fajrToMidnightDiff;
        remainingTime = totalDifference;
    }

    const durationRemainingTime = moment.duration(remainingTime);

    setRemainingTime(`${durationRemainingTime.seconds()} : ${durationRemainingTime.minutes()} : ${durationRemainingTime.hours()} `);
}

    const handleChange = (event) => {
        const cityObject = availableCities.find((city) => {
            return city.apiName === event.target.value;
        });
        setSelectedCity(cityObject);
    };
    


return (
    <div className='backGround'>
        {/*Top Row */} 
        <Grid container >
            <Grid item xs={6}>
                <div style={{marginRight:"50px"}}>
                    <h2>{today}</h2>
                    <h1>{selectedCity.displayName}</h1>
                </div>
            </Grid>
            <Grid item xs={6}>
                <div>
                    <h2>متبقي حتي صلاة {prayersArray[nextPrayerIndex].displayName}</h2>
                    <h1>{remainingTime}</h1>
                </div>
            </Grid>
        </Grid>
        {/*End The Top Row */}
        <Divider style={{borderColor:"black", opacity:".2"}}/>
        {/*Prayer cards*/}
        <Stack direction={'row'} style={{marginTop:'40px'}} justifyContent={"space-around"}>
            <Prayer name={"الفجر"} time={timings.Fajr} image={"https://wepik.com/api/image/ai/9a07baa7-b49b-4f6b-99fb-2d2b908800c2"}/>
            <Prayer name={"الظهر"} time={timings.Dhuhr} image={"https://wepik.com/api/image/ai/9a07bb45-6a42-4145-b6aa-2470408a2921"}/>
            <Prayer name={"العصر"} time={timings.Asr} image={"https://wepik.com/api/image/ai/9a07bb90-1edc-410f-a29a-d260a7751acf"}/>
            <Prayer name={"المغرب"} time={timings.Sunset} image={"https://wepik.com/api/image/ai/9a07bbe3-4dd1-43b4-942e-1b2597d4e1b5"}/>
            <Prayer name={"العشاء"} time={timings.Isha} image={"https://wepik.com/api/image/ai/9a07bc25-1200-4873-8743-1c370e9eff4d"}/>
        </Stack>
        {/*End prayer cards */}
        {/* start Selected city */}
        <Stack direction={"row"} justifyContent={"center"} style={{marginTop:"40px"}}>
            <FormControl style={{width:"20%"}}>
                <InputLabel id="demo-simple-select-label"><span>المدينة</span></InputLabel>
                <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    // value={age}
                    label="Age"
                    onChange={handleChange}
                >
                    {availableCities.map((city)=> {
                        return (
                            <MenuItem value={city.apiName} key={city.apiName}>
                                {city.displayName}
                            </MenuItem>
                        )
                    })}
                </Select>
            </FormControl>
        </Stack>
        {/* End Selected city */}
    </div>
)
}
export default MainContent;
