import { axios } from "axios";

export async function sendReqToModel(paragraph) {
  const data = {
    paragraph: paragraph,
  };
  axios
    .post("/http://192.168.1.14:5000/getIntent", JSON.stringify(data))
    .then(function (response) {
      const ResponseFromModel = [
        response.intent,
        response["DB_info"].split(/[\s,]+/)[0],
        response["DB_info"].split(/[\s,]+/)[1],
      ];
      return ResponseFromModel;
    })
    .catch(function (error) {
      console.log(error);
    });
}
