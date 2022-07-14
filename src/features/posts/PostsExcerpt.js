import PostAuthor from './postAuthor.js';
import TimeAgo from './TimeAgo.js';
import ReactionButtons from './ReactionButton.js';

const PostsExcerpt=({post})=> {
    return (
        <article>
            <h2>{post.title}</h2>
            <p className="excerpt">{post.body.substring(0, 75)}...</p>
            <p className="postCredit">
                <PostAuthor userId={post.userId} />
                <TimeAgo timestamp={post.date} />
            </p>
            <ReactionButtons post={post} />
        </article>
    )
}

export default PostsExcerpt