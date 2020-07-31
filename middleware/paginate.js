const paginate = (query, {
    page,
    pageSize,
    count
}) => {
    let limit = pageSize; // number of records to be returned
    let offset = 0;
    offset = limit * (page - 1);


    let paginate_links = {};
    const end = page * pageSize;
    const skip = pageSize * (page - 1);

    if (end < count) {
        paginate_links.next = {
            page: page + 1,
            limit: pageSize,
        };
    }
    if (skip > 0) {
        paginate_links.prev = {
            page: page - 1,
            limit: pageSize,
        };
    }

    return {
        ...query,
        offset,
        limit,
        count,
        page,
        paginate_links
    };
};

export default paginate