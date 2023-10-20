import "./App.css";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { useEffect, useState } from "react";
// MATERIAL UI COMPONENTS
import { Button, Container, Typography } from "@mui/material";
import WbCloudyIcon from "@mui/icons-material/WbCloudy";

// External libraries
import axios from "axios";
import moment from "moment/moment";
import { useTranslation } from "react-i18next";
import "moment/locale/ar";

const theme = createTheme({
  typography: {
    fontFamily: ["IBM"],
  },
});
// moment.locale("ar");
function App() {
  const { t, i18n } = useTranslation();
  const [temp, setTemp] = useState({
    number: null,
    desc: "",
    min: null,
    max: null,
    icon: null,
  });

  const [dateTime, setDateTime] = useState(null);

  const direction = i18n.language === "en";

  useEffect(() => {
    const lang = localStorage.getItem("i18nextLng") ?? "ar";
    moment.locale(lang);

    setDateTime(moment().format("LLLL"));
    const interval = setInterval(() => {
      setDateTime(moment().format("LLLL"));
    }, 60000);

    const abortController = new AbortController();

    axios
      .get(
        "https://api.openweathermap.org/data/2.5/weather?lat=8.76&lon=44.37&appid=e8e38b1910738e91159a15780c0c2a34",
        {
          signal: abortController.signal,
        }
      )
      .then(function (response) {
        // handle success
        console.log(response.data);
        const resTemp = Math.trunc(response.data.main.temp - 272.15);
        const min = Math.trunc(response.data.main.temp_min - 272.15);
        const max = Math.trunc(response.data.main.temp_max - 272.15);
        const desc = response.data.weather[0].description;
        const resIcon = response.data.weather[0].icon;

        setTemp((prevTemp) => ({
          ...prevTemp,
          number: resTemp,
          desc: desc,
          min: min,
          max: max,
          icon: `https://openweathermap.org/img/wn/${resIcon}@2x.png`,
        }));
      })
      .catch(function (error) {
        // handle error
        console.log(error);
      });

    return () => {
      clearInterval(interval);
      abortController.abort("component unmounted");
      console.log(abortController.signal);
    };
  }, []);

  return (
    <div className="App">
      <ThemeProvider theme={theme}>
        <Container maxWidth="sm">
          {/* Content Container */}
          <div
            style={{
              height: "100vh",
              flexDirection: "column",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              gap: "20px",
            }}
          >
            {/* CARD */}
            <div
              style={{
                background: "rgb(20 63 190)",
                color: "white",
                padding: "10px",
                borderRadius: "8px",
                boxShadow: "#1db5f11a 0px 11px 1px",
                width: "100%",
              }}
            >
              {/* CONTENT */}
              <div>
                {/* City & Time */}
                <div
                  dir={i18n.language === "en" ? "ltr" : "rtl"}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "start",
                  }}
                >
                  <Typography
                    variant="h2"
                    style={{ fontWeight: "600", marginRight: "20px" }}
                  >
                    {t("Egypt")}
                  </Typography>
                  <Typography variant="h5" style={{ marginRight: "20px" }}>
                    {dateTime}
                  </Typography>
                </div>
                {/*===== City & Time ====*/}
                <hr />
                {/* Container OF DEGREE + CLOUD ICON */}
                {/* DEGREE & DESCRIPTION */}
                <div
                  style={{ display: "flex", justifyContent: "space-around" }}
                >
                  <div style={{ order: direction ? "0" : "1" }}>
                    {/* Temp */}
                    <div style={{ display: "flex" }}>
                      <img alt="Weather State Icon" src={temp.icon}></img>
                      <Typography
                        variant="h1"
                        style={{
                          order: direction ? "-1" : "0",
                          textAlign: "right",
                        }}
                      >
                        {temp.number}
                      </Typography>
                    </div>
                    {/* ===Temp=== */}

                    <Typography
                      variant="h6"
                      style={{
                        textAlign: direction ? "left" : "right",
                      }}
                    >
                      {t(temp.desc)}
                    </Typography>

                    {/* MIN & MAX TEMP */}
                    <div
                      style={{
                        display: "flex",
                        gap: "10px",
                        justifyContent: direction ? "flex-start" : "flex-end",
                      }}
                    >
                      <h5>
                        {t("Max")} : {temp.min}
                      </h5>
                      <h5>|</h5>
                      <h5>
                        {t("Min")} : {temp.max}
                      </h5>
                    </div>
                  </div>
                  <WbCloudyIcon style={{ fontSize: "200px", color: "white" }} />
                </div>
                {/* =====DEGREE & DESCRIPTION===== */}
                {/*===== Container OF DEGREE + CLOUD ICON ===*/}
              </div>
              {/* ====CONTENT==== */}
            </div>
            {/* =====CARD =====*/}
            {/* TRANSLATION CONTAINER */}
            <Button
              onClick={() => {
                if (direction) {
                  i18n.changeLanguage("ar");
                  moment.locale("ar");
                } else {
                  i18n.changeLanguage("en");
                  moment.locale("en");
                }
                setDateTime(moment().format("LLLL"));
              }}
              variant="text"
              style={{ alignSelf: "start", display: "block", color: "white" }}
            >
              {direction ? "عربي" : "English"}
            </Button>
            {/* ====TRANSLATION CONTAINER==== */}
          </div>
          {/*==== Content Container =====*/}
        </Container>
      </ThemeProvider>
    </div>
  );
}

export default App;
