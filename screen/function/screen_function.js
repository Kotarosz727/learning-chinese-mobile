import ChineseInterator from "../../function/ChineseInterator";
import Amplify, { Auth } from "aws-amplify";

export async function translateFunction(text, toJapanese) {
  let url =
    "https://script.google.com/macros/s/AKfycbyXxnI_Fq939tnxFL9SDX0iz5Wh30WSq7oCRQRsaKcgxOmHHUd7Zq_Rjw/exec" +
    "?" +
    "text=" +
    text;

  if (toJapanese) {
    url = url + "&source=zh-cn" + "&target=ja";
    const japanese = await fetch(url);
    return japanese.json();
  } else {
    url = url + "&source=ja" + "&target=zh-cn";
    const chinese = await fetch(url);
    return chinese.json();
  }
}

export const getData = async (query, userid) => {
  let res = (await new ChineseInterator().fetchLists(query)) ?? [];
  if (!res) {
    return null;
  }
  if (userid) {
    res = checkIsFavorite(res, userid);
    return res;
  }
  return res;
};

export const checkIsFavorite = async (value, userid) => {
  //make bookmark true if it is bookmarked
  const favoriteItems = await new ChineseInterator().fetchFavorites(userid);

  if (favoriteItems) {
    const bookmarked_array = [];
    
    favoriteItems.map((r) => {
      const chinese = r.chinese;
      bookmarked_array.push(chinese);
    });

    value.map((v) => {
      if (bookmarked_array.findIndex((item) => item === v.chinese) >= 0) {
        v.bookmark = true;
      }
    });
  }
  return value;
};

export const getfavorites = async (userid) => {
  const res = await new ChineseInterator().fetchFavorites(userid);
  if (res) {
    res.map((v) => {
      v.bookmark = true;
    });
    return res;
  }
};

export const getNotes = async (userid) => {
  const res = await new ChineseInterator().fetchNotes(userid);
  if (res) {
    res.map((v) => {
      v.bookmark = "note";
    });
    return res;
  }
};

export const logout = async () => {
  try {
    await Auth.signOut();
  } catch (e) {
    console.log("log out error", e);
  }
};
