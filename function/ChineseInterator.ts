import AsyncStorage from "@react-native-async-storage/async-storage";
export default class ChineseInterator {
  url_fetchAll: string;
  url_postFavorite: string;
  url_fetchFavorite: string;

  constructor() {
    this.url_fetchAll =
      "https://mlsei45cm3.execute-api.ap-northeast-1.amazonaws.com/dev/sentences";
    this.url_postFavorite = this.url_fetchAll;  
    this.url_fetchFavorite =
      "https://mlsei45cm3.execute-api.ap-northeast-1.amazonaws.com/dev/favorites";
  }

  public fetchLists = async (): Promise<[] | null> => {
    console.log("fetchingList");
    try {
      const res = await fetch(this.url_fetchAll, { method: "GET" });
      const sentences = await res.json();
      return sentences.Items;
    } catch (e) {
      console.log(e);
      return null;
    }
  };

  public postFavorite = async (data:any, userid:string): Promise<void> => {
      const mappeddata = {
          userid: userid,
          chinese: data.chinese,
          japanese: data.japanese,
          pinin: data.pinin,
          type: "favorite",
      };
      console.log('posting favorite');
      try {
          const res = await fetch(this.url_postFavorite, {
              method: "POST",
              // mode: "no-cors",
              headers: {
                  "content-Type": "application/json",
              },
              body: JSON.stringify(mappeddata),
          });
      } catch (e) {
          console.log("got error", e);
      }
  };

  // public postNote = async (data, userid, url) => {
  //     const mappeddata = {
  //         userid: userid,
  //         chinese: data.mychinese,
  //         japanese: data.myjapanese,
  //         pinin: data.mypinin,
  //         type: "note",
  //     };
  //     try {
  //         const res = await fetch(url, {
  //             method: "POST",
  //             // mode: "no-cors",
  //             headers: {
  //                 "content-Type": "application/json",
  //             },
  //             body: JSON.stringify(mappeddata),
  //         });
  //         console.log(res);

  //         return await res.json();
  //     } catch (e) {
  //         console.log("got error", e);
  //     }
  // };

  public fetchFavorites = async (userid: string) => {
    if (userid) {
      const data = {
        userid: userid,
      };
      console.log("fetchingFavorites");
      const res = await fetch(this.url_fetchFavorite, {
        method: "POST",
        // mode: "no-cors",
        headers: {
          "content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      const json = await res.json();
      const sentences = json.Items;
      const ret_arr = sentences.reduce(
        (accumulater: any, currentValue: any) => {
          if (currentValue.type != "note") {
            accumulater.push(currentValue);
          }
          return accumulater;
        },
        []
      );
      return ret_arr;
    }
  };

  public getAllAsyncStorage = async () => {
    try {
      const allKeys = await this.getAllKeys();
      const ret_arr: any = [];
      await allKeys?.map(async (v) => {
        const favorite: [] = await this.getAsyncStorageItem(v);
        ret_arr.push(favorite);
      });
      return ret_arr;
    } catch (e) {
      console.log(e);
    }
  };

  public storeDataToAsyncStorage = async (value: any) => {
    try {
      const jsonValue = JSON.stringify(value);
      await AsyncStorage.setItem(value.japanese, jsonValue);
      console.log("OK");
    } catch (e) {
      console.log(e);
    }
  };

  public removeDataFromAsyncStorage = async (value: string) => {
    try {
      await AsyncStorage.removeItem(value);
    } catch (e) {
      // remove error
    }
    console.log("Done.");
  };

  public getAsyncStorageItem = async (value: string) => {
    try {
      const jsonValue = await AsyncStorage.getItem(value);
      return jsonValue != null ? JSON.parse(jsonValue) : [];
    } catch (e) {
      console.log("getAsyncStorageItem error:", e);
    }
  };

  public getAllKeys = async () => {
    try {
      const mykeys: string[] = await AsyncStorage.getAllKeys();
      return mykeys;
    } catch (e) {
      // read key error
    }
  };

  public clearAll = async () => {
    try {
      await AsyncStorage.clear();
    } catch (e) {
      // clear error
    }

    console.log("Done.");
  };

  // public fetchNotes = async (url, userid): Promise<[] | null> => {
  //     if (userid && url) {
  //         const data = {
  //             userid: userid,
  //         };
  //         console.log('fetchingNotes')
  //         const res = await fetch(url, {
  //             method: "POST",
  //             // mode: "no-cors",
  //             headers: {
  //                 "content-Type": "application/json",
  //             },
  //             body: JSON.stringify(data),
  //         });
  //         const json = await res.json();
  //         const sentences = json.Items;
  //         const ret_arr = sentences.reduce((accumulater, currentValue) => {
  //             if (currentValue.type === "note") {
  //                 accumulater.push(currentValue);
  //             }
  //             return accumulater;
  //         }, []);
  //         return ret_arr;
  //     }
  // };

  // public deleteFavorite = async (url: string, data: { userid: string; chinese: string }) => {
  //     const res = await fetch(url, {
  //         method: "DELETE",
  //         headers: {
  //             "content-Type": "application/json",
  //         },
  //         body: JSON.stringify(data),
  //     });
  //     console.log("deleted");
  // };

  // public deleteNote = async (url: string, data: { userid: string; chinese: string }) => {
  //     const res = await fetch(url, {
  //         method: "DELETE",
  //         headers: {
  //             "content-Type": "application/json",
  //         },
  //         body: JSON.stringify(data),
  //     });
  //     console.log("deleted");
  // };
}
