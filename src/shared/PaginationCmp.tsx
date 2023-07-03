import React from 'react';
import ReactPaginate from 'react-paginate';
import styles from './PaginationCmp.module.scss';

const PaginationCmp: React.FC<{ totalPage: number; selectedPage?: number; onPageClick: (event: any) => void }> = ({
    totalPage,
    selectedPage,
    onPageClick,
}) => {
    return (
        <ReactPaginate
            breakLabel="..."
            previousLabel="<"
            nextLabel=">"
            onPageChange={onPageClick}
            pageRangeDisplayed={5}
            pageCount={totalPage}
            forcePage={selectedPage}
            //renderOnZeroPageCount={null}
            containerClassName={styles.pagination}
            pageLinkClassName={styles.pageNum}
            nextLinkClassName={styles.pageNum}
            previousLinkClassName={styles.pageNum}
            activeLinkClassName={styles.active}
        />
    );
};

export default PaginationCmp;
