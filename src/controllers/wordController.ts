import { HOST, TOKEN_NAME } from "../helpers/helpers";
import { wordProperty, wordStatus } from "../helpers/types";


class WordController{
    private static instance: WordController;

    public static getInstance(): WordController {
        if (!WordController.instance) {
            WordController.instance = new WordController();
        }
        return WordController.instance;
    }
    
    async addStatus( wordId: string, word: wordProperty, succesAction: ()=>void){
        const {jwt, userId} = localStorage;
        const resp = await fetch(`${HOST}/users/${userId}/words/${wordId}`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${jwt}`,
                'Accept': 'application/json',
                'Content-Type': 'application/json'
              },
              body: JSON.stringify(word)
        });
        if(resp.ok){
            succesAction();
        }
    }
    async updateStatus( wordId: string, word: wordProperty, succesAction: ()=>void){
        const {jwt, userId} = localStorage;
        const resp = await fetch(`${HOST}/users/${userId}/words/${wordId}`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${jwt}`,
                'Accept': 'application/json',
                'Content-Type': 'application/json'
              },
              body: JSON.stringify(word)
        });
        if(resp.ok){
            succesAction();
        }
    }
    async deleteStatus( wordId: string, succesAction: ()=>void){
        const {jwt, userId} = localStorage;
        const resp = await fetch(`${HOST}/users/${userId}/words/${wordId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${jwt}`,
                'Accept': 'application/json',
              },
        });
        if(resp.ok){
            succesAction();
        }
    }
}

export default WordController