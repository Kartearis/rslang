import { HOST } from '../helpers/helpers';
import { wordType } from '../helpers/types';

class EBookController {
    async getGroupWords(group: number, page: number): Promise<wordType[] | null> {
        const response = await fetch(`${HOST}/words?group=${group}&page=${page}`, {
            method: 'GET',
        });
        if (response.status === 200) {
            return (await response.json()) as wordType[];
        }
        return null;
    }
}

export default EBookController;
