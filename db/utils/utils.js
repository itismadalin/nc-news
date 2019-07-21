exports.formatDates = list => {
    return list.map(item => {
        item.created_at = new Date(item.created_at);
        return item;
    });
};

exports.makeRefObj = (list) => {
    const newObj = {};
    list.forEach(item => {
        return (newObj[item.title] = item.article_id);
    });
    return newObj;
};

exports.formatComments = (comments, articleRef) => {
    return comments.map(comment => {
        const author = comment.created_by;
        comment.created_at = new Date(comment.created_at);
        const { belongs_to, created_by, ...restOfComments } = comment;
        const article_id = articleRef[belongs_to];
        return { article_id, author, ...restOfComments };
    });
};