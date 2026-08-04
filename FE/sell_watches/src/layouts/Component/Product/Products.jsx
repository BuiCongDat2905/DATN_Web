import classNames from 'classnames/bind';
import style from './Products.module.scss';
import { Link } from 'react-router-dom';
import { formatNumber, validUrl } from '~/components/format';

const cx = classNames.bind(style);
function Products({ products, linkTo }) {
    return (
        <div className={cx('products')}>
            {products &&
                (() => {
                    const productArray = Object.values(products);
                    const chunkArray = (array, size) => {
                        const result = [];
                        for (let i = 0; i < array.length; i += size) {
                            result.push(array.slice(i, i + size));
                        }
                        return result;
                    };
                    const groupedProducts = chunkArray(productArray, 5);
                    return groupedProducts.map((group, groupIndex) => (
                        <div key={`group-${groupIndex}`} className={cx('product-group')}>
                            {group.map((value, index) => (
                                <div key={index} className={cx('product')}>
                                    <Link
                                        to={`/dong-ho/${linkTo || validUrl(value.loai)}/${value.id}`}
                                        className={cx('img')}
                                    >
                                        <img src={value.hinh_anh} alt="" />
                                        <div className={cx('discount')}>-10%</div>
                                        <div className={cx('gift')}>Mua 1 tặng 1</div>
                                    </Link>
                                    <Link
                                        to={`dong-ho/${linkTo}/${validUrl(value.ten_san_pham)}-${validUrl(value.ma_san_pham)}`}
                                        className={cx('name')}
                                    >
                                        <span>{value.ten_san_pham}</span>
                                        <span>{value.ma_san_pham}</span>
                                    </Link>
                                    <div className={cx('description')}>
                                        <span className={cx('type')}>{value.loai_may}</span>
                                        <span>|</span>
                                        <span className={cx('diameter')}>{value.duong_kinh}mm</span>
                                    </div>
                                    <div className={cx('price')}>
                                        <span>Giá:</span>
                                        <div>
                                            <span>{formatNumber(value.gia)}</span>
                                            <span>₫</span>
                                        </div>
                                    </div>
                                    <div className={cx('promotion')}>
                                        <span>Giá km:</span>
                                        <div>
                                            <span>62.700.000</span>
                                            <span>₫</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ));
                })()}
        </div>
    );
}

export default Products;
