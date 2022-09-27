import "./App.css";
import { Button } from "@mui/material";
import "./db";
import { database } from "./db";
import React, { useEffect, useState } from "react";
import Item from "./Item";

function App() {
  const [players, setPlayers] = useState();

  useEffect(() => {
    database.collection("jackasses").onSnapshot((snapshot) => {
      if (!snapshot.exists) {
        console.log("Doc not found");
      }
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
      ret.sort((a, b) => b.trophies - a.trophies + (b.wins - a.wins));
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
      kFactor = 32
    } else if (winner.trophies >= 2100 && winner.trophies <= 2400) {
      kFactor = 24
    } else {
      kFactor = 16
    }
    let factor =
      1 / (1 + Math.pow(10, (winner.trophies - loser.trophies) / 400));
<<<<<<< HEAD
    console.log("Winner " + winner.trophies + kFactor * (1 - factor));
    return winner.trophies + kFactor * (1 - factor);
=======
    return winner.trophies + 16 * (1 - factor);
>>>>>>> b89c8bc (update trophies)
  }

  function calculateLoserScore(winner, loser) {
    let kFactor = 0
    if (loser.trophies < 2100) {
      kFactor = 32
    } else if (loser.trophies >= 2100 && loser.trophies <= 2400) {
      kFactor = 24
    } else {
      kFactor = 16
    }
    let factor =
      1 / (1 + Math.pow(10, (loser.trophies - winner.trophies) / 400));
<<<<<<< HEAD
    console.log("Loser " + loser.trophies + kFactor * (0 - factor));
    return loser.trophies + kFactor * (0 - factor);
=======
    return loser.trophies + 16 * (0 - factor);
>>>>>>> b89c8bc (update trophies)
  }

  function recordAction() {
    let winText = "Who won? Enter number next to the name: \n";
    let loseText = "Who lost? Enter number next to the name: \n";
    let nameEncoding = "";
    for (let i = 1; i < players.length; i++) {
      nameEncoding += `${i} ${players[i].name}\n`;
    }
    winText += nameEncoding;
    loseText += nameEncoding;

    let winIndex = prompt(winText);
    let loseIndex = prompt(loseText);

    if (winIndex <= players.length && loseIndex <= players.length) {
      let winner = players[winIndex];
      let loser = players[loseIndex];
      console.log(winner.name);
      console.log(loser.name);
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
        </div>
      </div>
    </div>
  );
}

export default App;
