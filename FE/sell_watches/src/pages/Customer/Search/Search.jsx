import classNames from 'classnames/bind';
import style from './Search.module.scss';
import { Link, useLocation, useSearchParams } from 'react-router-dom';
import Navigation from '~/layouts/Component/Navigation';
import { useEffect, useState } from 'react';
import { listFilter } from '~/data';
import Products from '~/layouts/Component/Product';
import { searchProduct } from '~/apiServices/Product/searchProducts';
import Pagination from '~/layouts/Component/Paginatio/Pagination';
import { IconSortDown } from '~/components/icon';
import { postFilterProducts } from '~/apiServices/Product/postFilterProducts';
import { fomatPriceFilter, formatDiameter, formatFilterValue } from '~/components/format';

const cx = classNames.bind(style);
function Search() {
    const location = useLocation();
    const path = location.pathname;
    const [searchParams] = useSearchParams();
    const [page, setPage] = useState('0');
    const [totalPage, setTotalPage] = useState();
    const [products, setProducts] = useState();
    // const [query, setQuery] = useState('');
    const [filter, setFilter] = useState({
        // keyword: null,
        // gia: null,
        // loai: null,
        // loai_may: null,
        // mat_kinh: null,
        // chat_lieu_vo: null,
        // chat_lieu_day: null,
        // mau_mat: null,
        // xuat_xu: null,
        // kieu_dang: null,
        // phong_cach: null,
        // duong_kinh: null,
        // do_day: null,
        // khang_nuoc: null,
        // thuong_hieu: null,
        // gioi_tinh: null,
        // khac: null,
        // sortBy: null,
        // sortDirection: null,
        // fuzzy: true,
        // page: 0,
        // size: 10,
    });
    const [notFilter, setNotFilter] = useState([
        'minGia',
        'maxGia',
        'minDuongKinh',
        'maxDuongKinh',
        'page',
        'size',
        'fuzzy',
    ]);
    const listFilterProduct = listFilter;
    useEffect(() => {
        const searchQuery = searchParams.get('q') || '';
        const formattedQuery = searchQuery.replace(/-/g, ' ');
        setFilter((prev) => ({
            ...prev,
            keyword: formattedQuery !== '' ? formattedQuery : null,
        }));
    }, [searchParams]);

    const handlerPage = (e) => {
        setFilter((prev) => ({
            ...prev,
            page: e,
        }));
        setPage(e);
        window.scroll(0, 0);
    };
    const handlerDeleteFilterValue = (value) => {
        if (value === 'All') {
            setFilter({});
            return;
        }
        setFilter((prev) => ({
            ...prev,
            keyword: '',
            [value]: null,
        }));
    };
    const handlerAddFilterValue = (key, value) => {
        if (key === 'page' || key === 'size') {
            return;
        }
        let price = {
            min: null,
            max: null,
        };
        let diameter = {
            min: null,
            max: null,
        };
        if (key === 'mucGia') {
            price = fomatPriceFilter(value);
            if (price.min !== null) {
                setFilter((prev) => ({
                    ...prev,
                    minGia: price.min * 1000000,
                }));
            }
            if (price.max !== null) {
                setFilter((prev) => ({
                    ...prev,
                    maxGia: price.max * 1000000,
                }));
            }
        }
        if (key === 'duongKinh') {
            diameter = formatDiameter(value);
            if (diameter.min !== null) {
                setFilter((prev) => ({
                    ...prev,
                    minDuongKinh: diameter.min,
                }));
            }
            if (diameter.max !== null) {
                setFilter((prev) => ({
                    ...prev,
                    maxDuongKinh: diameter.max,
                }));
            }
        }
        if (!notFilter.includes(key)) {
            setFilter((prev) => ({
                ...prev,
                [key]: value,
            }));
        }
    };
    useEffect(() => {
        async function fetch() {
            console.log('filter', filter);
            try {
                const res = await searchProduct(filter);
                if (res.status === 'success') {
                    setTotalPage(res.data.totalPages);
                    setProducts(res.data.content);
                }
            } catch (err) {
                console.log(err);
            }
        }
        fetch();
    }, [filter]);
    return (
        <div className="container">
            <Navigation path={path} />
            <div className={cx('filter')}>
                <div className={cx('filter-value')}>
                    {Object.values(filter).some((value) => value !== null) ? (
                        <ul>
                            {Object.keys(filter).map((value, index) =>
                                filter[value] !== null && !notFilter.includes(value) ? (
                                    <li onClick={() => handlerDeleteFilterValue(value)} key={index}>
                                        {filter[value]}
                                    </li>
                                ) : null,
                            )}

                            <li onClick={() => handlerDeleteFilterValue('All')} className={cx('delete-all')}>
                                Xóa hết
                            </li>
                        </ul>
                    ) : null}
                </div>
                <div className={cx('product-filter')}>
                    {Object.values(listFilterProduct).map((key, index) => {
                        return (
                            <div key={index} className={cx('filter-menu')}>
                                <div className={cx('title')}>{key.title}</div>

                                {key.data ? (
                                    <ul className={`wrapper ${cx('filter')}`}>
                                        {key.data.map((value, index) => {
                                            return (
                                                <li
                                                    key={index}
                                                    onClick={() =>
                                                        handlerAddFilterValue(formatFilterValue(key.title), value)
                                                    }
                                                >
                                                    <Link> {value}</Link>
                                                </li>
                                            );
                                        })}
                                    </ul>
                                ) : null}

                                <IconSortDown />
                            </div>
                        );
                    })}
                </div>
            </div>
            <div className={cx('product')}>{products ? <Products products={products} /> : null}</div>
            <Pagination totalPage={totalPage} currentPage={page} onPageChange={handlerPage} />
        </div>
    );
}

export default Search;
