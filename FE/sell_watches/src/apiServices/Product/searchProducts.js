import * as request from '~/utils/request';

export const searchProduct = async (data) => {
    try {
        const res = await request.post(`products/search`, data);
        return res;
    } catch (err) {
        console.log(err);
    }
};
