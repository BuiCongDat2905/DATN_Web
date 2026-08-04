import React from 'react';
import classNames from 'classnames/bind';
import style from './Pagination.module.scss';
const cx = classNames.bind(style);

const Pagination = ({ totalPage, currentPage, onPageChange }) => {
    const displayedPage = Number(currentPage) + 1;
    const getPages = () => {
        let pages = [];
        if (totalPage <= 5) {
            for (let i = 1; i <= totalPage; i++) {
                pages.push(i);
            }
        } else {
            if (displayedPage <= 3) {
                pages = [1, 2, 3, 4, '...', totalPage];
            } else if (displayedPage >= totalPage - 2) {
                pages = [1, '...', totalPage - 3, totalPage - 2, totalPage - 1, totalPage];
            } else {
                pages = [1, '...', displayedPage - 1, displayedPage, displayedPage + 1, '...', totalPage];
            }
        }
        return pages;
    };

    const pages = getPages();

    return (
        <div className={cx('total-page')}>
            {totalPage > 1 ? (
                <>
                    <span
                        className={cx('navigation', { hidden: currentPage === 0 })}
                        onClick={() => currentPage > 0 && onPageChange(0)}
                    >
                        ‹‹
                    </span>

                    <span
                        className={cx('navigation', { hidden: currentPage === 0 })}
                        onClick={() => currentPage > 0 && onPageChange(currentPage - 1)}
                    >
                        ‹
                    </span>

                    {pages.map((page, index) =>
                        page === '...' ? (
                            <span key={index} className={cx('dots')}>
                                ...
                            </span>
                        ) : (
                            <span
                                key={index}
                                className={cx('page-item', { active: displayedPage === page })}
                                onClick={() => onPageChange(page - 1)}
                            >
                                {page}
                            </span>
                        ),
                    )}

                    <span
                        className={cx('navigation', { hidden: currentPage === totalPage - 1 })}
                        onClick={() => currentPage < totalPage - 1 && onPageChange(currentPage + 1)}
                    >
                        ›
                    </span>

                    <span
                        className={cx('navigation', { hidden: currentPage === totalPage - 1 })}
                        onClick={() => currentPage < totalPage - 1 && onPageChange(totalPage - 1)}
                    >
                        ››
                    </span>
                </>
            ) : null}
        </div>
    );
};

export default Pagination;
