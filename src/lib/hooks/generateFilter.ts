export const generateFilter = ({...props}) => {
    const {filterCB} = props;
    let query = '';
    Object.keys(filterCB).forEach(key => {
        if (filterCB[key] && (filterCB[key].length > 0 || Boolean(filterCB[key]))) {
            query.length === 0 ? query += `?${key}=${filterCB[key]}` : query += `&${key}=${filterCB[key]}`;
        }
    });
    return query;
};
