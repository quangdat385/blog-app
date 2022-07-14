import {createSlice,nanoid,createAsyncThunk} from '@reduxjs/toolkit';
import {sub} from 'date-fns'
import axios from "axios";

const POSTS_URL='https://jsonplaceholder.typicode.com/posts'



const initialState={
    posts:[],
    status:'idle' ,//(idle,loading,succeed,failed)
    error:null
}

export const fetchPosts = createAsyncThunk('posts/fetchPosts', async () => {
    const response = await axios.get(POSTS_URL)
    return response.data
})
export const addNewPost = createAsyncThunk('posts/addNewPost', async (initialPost) => {
    const response = await axios.post(POSTS_URL, initialPost)
    return response.data
})


const postsSlice = createSlice({
    name:'posts',
    initialState,
    reducers :{
        postAdded:{
            reducer(state,action){
                state.posts.push(action.payload)
            },
            prepare(title,content,userId){
                return {
                    payload:{
                        id:nanoid(),
                        title,
                        content,
                        userId,
                        date:new Date().toISOString(),
                        reactions:{
                            thumbsUp:0,
                            wow:0,
                            heart:0,
                            rocket:0,
                            coffee:0,
                        }
                    }
                }
            }
        },
        reactionAdded(state,action){
            const { postId, reaction } = action.payload
            
            const existingPost = state.posts.find(post => post.id === postId)
            if (existingPost) {
                
                existingPost.reactions[reaction]++
            }
        }    
    },
    extraReducers(builder) {
        builder
            .addCase(fetchPosts.pending, (state, action) => {
                state.status = 'loading'
            })
            .addCase(fetchPosts.fulfilled, (state, action) => {
                state.status = 'succeeded'
                // Adding date and reactions
                let min = 1;
                const loadedPosts = action.payload.map(post => {
                    post.date = sub(new Date(), { minutes: min++ }).toISOString();
                    post.reactions = {
                        thumbsUp: 0,
                        wow: 0,
                        heart: 0,
                        rocket: 0,
                        coffee: 0
                    }
                    return post;
                });

                // Add any fetched posts to the array
                state.posts = state.posts.concat(loadedPosts)
            })
            .addCase(fetchPosts.rejected, (state, action) => {
                state.status = 'failed'
                state.error = action.error.message
            })
            .addCase(addNewPost.fulfilled, (state, action) => {
                
                action.payload.userId = Number(action.payload.userId)
                action.payload.date = new Date().toISOString();
                action.payload.reactions = {
                    thumbsUp: 0,
                    wow: 0,
                    heart: 0,
                    rocket: 0,
                    coffee: 0
                }
                console.log(action.payload)
                state.posts.push(action.payload)
            })
            // .addCase(updatePost.fulfilled, (state, action) => {
            //     if (!action.payload?.id) {
            //         console.log('Update could not complete')
            //         console.log(action.payload)
            //         return;
            //     }
            //     const { id } = action.payload;
            //     action.payload.date = new Date().toISOString();
            //     const posts = state.posts.filter(post => post.id !== id);
            //     state.posts = [...posts, action.payload];
            // })
            // .addCase(deletePost.fulfilled, (state, action) => {
            //     if (!action.payload?.id) {
            //         console.log('Delete could not complete')
            //         console.log(action.payload)
            //         return;
            //     }
            //     const { id } = action.payload;
            //     const posts = state.posts.filter(post => post.id !== id);
            //     state.posts = posts;
            // })
    }
    

    
})
export const {postAdded,reactionAdded}=postsSlice.actions

export const selectAllPosts=(state) =>state.posts.posts
export const getPostsStatus=(state) =>state.posts.status
export const getPostsError=(state) =>state.posts.error


export default postsSlice.reducer
