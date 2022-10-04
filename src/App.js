import "./App.css";
import { Button } from "@mui/material";
import "./db";
import { database, firebase } from "./db";
import React, { useEffect, useState } from "react";
import Item from "./Item";
import { data } from "autoprefixer";

function App() {
  const [players, setPlayers] = useState();

  useEffect(() => {
    database.collection("jackasses").onSnapshot((snapshot) => {
      
      let ret = [
        {
          name: "Name",
          wins: "W",
          losses: "L",
          trophies: "Points",
        },
      ];
      snapshot.forEach((doc) => {
        let data = doc.data();
        ret.push({
          name: data.name,
          wins: data.wins,
          losses: data.losses,
          trophies: data.trophies,
          id: doc.id,
        });
      });
      ret.sort((a, b) => b.trophies - a.trophies) // - a.trophies + (b.wins - a.wins));
      setPlayers(ret);
    });
  }, []);

  function joinAction() {
    const name = prompt("Your name?");
    if (name.length > 0) {
      database.collection("jackasses").add({
        name: name,
        wins: 0,
        losses: 0,
        trophies: 1850,
      });
    }
  }

  function calculateWinnerScore(winner, loser) {
    let kFactor = 0
    if (winner.trophies < 2100) {
      kFactor = 64
    } else if (winner.trophies >= 2100 && winner.trophies <= 2400) {
      kFactor = 48
    } else {
      kFactor = 32
    }
    let factor =
      1 / (1 + Math.pow(10, (loser.trophies - winner.trophies) / 400));
    return winner.trophies + kFactor * (1 - factor);
  }

  function calculateLoserScore(winner, loser) {
    let kFactor = 0
    if (loser.trophies < 2100) {
      kFactor = 64
    } else if (loser.trophies >= 2100 && loser.trophies <= 2400) {
      kFactor = 48
    } else {
      kFactor = 32
    }
    let factor =
      1 / (1 + Math.pow(10, (winner.trophies - loser.trophies) / 400));
    return loser.trophies + kFactor * (0 - factor);
  }

  function simulate() {
    database.collection("jackasses").get().then(snapshot => {
      console.log(snapshot)
      snapshot.forEach(doc => {
        let id = doc.id;
        database.collection("jackasses").doc(id).update({
          history: [],
          losses: 0,
          wins: 0,
          name: doc.data().name,
          trophies: 1850
        })
      })
    })

    database.collection("history").doc("history").get().then(doc => {
      if (!doc.exists) {
        console.log("Doc does not exist");
      } else {
        const data = doc.data();
        for (const [key, value] of Object.entries(data)) {
          if (key == "size") {
            break;
          }
          recordAction(value.winner, value.loser);
        }
      }
    })
  }

  function recordAction(winner = "", loser = "") {

    let shouldSimulate = false;
    if (winner != "" && loser != "") {
      shouldSimulate = true;
    }

    let winText = "Who won? Enter number next to the name: \n";
    let loseText = "Who lost? Enter number next to the name: \n";
    let nameEncoding = "";
    for (let i = 1; i < players.length; i++) {
      nameEncoding += `${i} ${players[i].name}\n`;
    }
    winText += nameEncoding;
    loseText += nameEncoding;

    let winIndex = 0;
    let loseIndex = 0;

    if (shouldSimulate) {
      winIndex = players.findIndex(player => player.name === winner);
      loseIndex = players.findIndex(player => player.name === loser);
    } else {
      winIndex = prompt(winText);
      loseIndex = prompt(loseText);
    }

    if (winIndex <= players.length && loseIndex <= players.length) {
      let winner = players[winIndex];
      let loser = players[loseIndex];

    database.collection("jackasses").doc(winner.id)
    .update({
      history: firebase.firestore.FieldValue.arrayUnion(loser.id)
    });

    database.collection("jackasses").doc(loser.id)
    .update({
      history: firebase.firestore.FieldValue.arrayUnion(winner.id)
    });

    if (!shouldSimulate) {
      database.collection("history").doc("history").get().then(doc => {
        if (!doc.exists) {
          console.log("Data does not exist")
        } else {
          let d = doc.data();
          let index = d.size + 1;
          database.collection("history").doc("history").update({size: index});
          database.collection("history").doc("history").update({
            [index]: {
              winner: winner.name,
              loser: loser.name
            }
          });
        }
      });
    }
    console.log(winner.wins);
    database
      .collection("jackasses")
      .doc(winner.id)
      .update({
        wins: winner.wins + 1,
        trophies: calculateWinnerScore(winner, loser),
      });

    database
      .collection("jackasses")
      .doc(loser.id)
      .update({
        losses: loser.losses + 1,
        trophies: calculateLoserScore(winner, loser),
      });
    } else {
      alert("Please re-record with correct values");
    }
  }

  return (
    <div class="flex flex-col place-content-evenly">
      <h1 class="font-sans text-2xl"> Pool Tracker </h1>
      <div className="App">
        <div class="w-1/2 grid gap-4 grid-rows-1 ml-12 mr-12 mt-8 p-6">
          {players !== undefined ? (
            players.map((pl) =>
              pl.name === "Name" ? (
                <Item
                  name={pl.name}
                  wins={pl.wins}
                  losses={pl.losses}
                  trophies={Math.round(pl.trophies)}
                  first={true}
                />
              ) : (
                <Item
                  name={pl.name}
                  wins={pl.wins}
                  losses={pl.losses}
                  trophies={Math.round(pl.trophies)}
                  first={false}
                />
              )
            )
          ) : (
            <div></div>
          )}
        </div>
        <div class="flex flex-col place-content-evenly">
          <Button onClick={() => recordAction()} variant="contained">
            Record
          </Button>
          <Button onClick={() => joinAction()} variant="contained">
            Join
          </Button>
          <Button onClick={() => simulate()} variant="contained">
            Simulate
          </Button>
        </div>
      </div>
    </div>
  );
}

export default App;
