exports.formatDates = list => {
    return list.map(item => {
        item.created_at = new Date(item.created_at);
        return item;
    });
};

exports.makeRefObj = list => {
    
};

exports.formatComments = (comments, articleRef) => {

};
