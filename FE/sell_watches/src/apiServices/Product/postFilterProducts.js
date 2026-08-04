import * as request from '~/utils/request';

export const postFilterProducts = async (data) => {
    try {
        const res = await request.post('products/filter', data);
        return res;
    } catch (err) {
        console.log(err);
    }
};
