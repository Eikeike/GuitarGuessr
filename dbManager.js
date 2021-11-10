import * as SQLite from "expo-sqlite";
import { Platform} from 'react-native';

function openDB() {
    if (Platform.OS === "web") {
      return {
        transaction: () => {
          return {
            executeSql: () => {},
          };
        },
      };
    }
  
    const db = SQLite.openDatabase("db.db");
    return db;
  }

const db = openDB();

const addToDB = (chord) => {

    if (chord === null || chord === "") {
      return false;
    }

    db.transaction(
      (tx) => {
        tx.executeSql("insert into chords (name) values (?)", [chord]);
        tx.executeSql("select * from chords", [], (_, { rows }) =>
          console.log(JSON.stringify(rows))
        );
      },
      null,
      null
    );
  };

  const initDB = () => {
    db.transaction((tx) => {
        tx.executeSql(
          "create table if not exists chords (name text);"
        );
      });
  };

  const printDB = () => {
      db.transaction(
    (tx) => {
      tx.executeSql("select * from chords", [], (_, {rows}) =>
        console.log(JSON.stringify(rows))
      );
    },
    null,
    (err) => {err && console.log(err)}
  );
};

const getItems = async () => {
    return new Promise((resolve, reject) => 
        {db.transaction(
            (tx) => {
                tx.executeSql("select * from chords", [], (_, {rows}) =>
                    {resolve(rows._array)}
                )
            },
            reject
        )
    })
};

const deleteItem = async (name)=> {
    console.log('deleting');
    return new Promise( (resolve, reject) => {
        db.transaction(
            (tx) => {
                tx.executeSql('delete from chords where name = ?', [name], (_, {rows}) => {
                    resolve(true);
                })
            },
            reject
        )
    })
}

const dropAll = () => {
    db.transaction((tx) => {
        tx.executeSql(
          "drop table chords"
        );
      });
}

  export {addToDB, initDB, printDB, dropAll, getItems, deleteItem}