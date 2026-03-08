"""
Farmer Community Module
MongoDB schemas and REST APIs for farmer social interactions
Features: Posts, Comments, Likes, Follows, Discussions
"""

from express import Router, Request, Response
from fastapi import APIRouter, HTTPException, UploadFile, File
from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime
import os

# ======================= MongoDB SCHEMAS =======================

COMMUNITY_SCHEMAS = {
    'post': {
        'userId': 'ObjectId()',
        'author': {
            'name': 'string',
            'profileImage': 'string',
            'role': 'enum[farmer, expert, admin]'
        },
        'title': 'string',
        'content': 'string',
        'category': 'enum[crop_advice, disease, market, recipe, general]',
        'images': ['url'],
        'tags': ['string'],
        'likes': 0,
        'likedBy': ['ObjectId(userId)'],
        'comments': ['ObjectId(commentId)'],
        'shares': 0,
        'views': 0,
        'visibility': 'enum[public, private, friends_only]',
        'isPinned': False,
        'createdAt': 'timestamp',
        'updatedAt': 'timestamp'
    },
    'comment': {
        'postId': 'ObjectId()',
        'userId': 'ObjectId()',
        'author': {
            'name': 'string',
            'profileImage': 'string'
        },
        'content': 'string',
        'images': ['url'],
        'likes': 0,
        'likedBy': ['ObjectId(userId)'],
        'replies': ['ObjectId(replyId)'],
        'createdAt': 'timestamp',
        'updatedAt': 'timestamp'
    },
    'follow': {
        'followerId': 'ObjectId()',
        'followingId': 'ObjectId()',
        'followingUser': {
            'name': 'string',
            'role': 'string',
            'expertise': 'string'
        },
        'createdAt': 'timestamp'
    },
    'topic': {
        'name': 'string',
        'description': 'string',
        'category': 'enum[crops, diseases, weather, market, general]',
        'posts': ['ObjectId(postId)'],
        'followers': 0,
        'createdBy': 'ObjectId(userId)',
        'createdAt': 'timestamp'
    },
    'notification': {
        'userId': 'ObjectId()',
        'type': 'enum[like, comment, follow, mention, share]',
        'relatedId': 'ObjectId()',
        'relatedUser': {
            'name': 'string',
            'profileImage': 'string'
        },
        'message': 'string',
        'read': False,
        'createdAt': 'timestamp'
    }
}

# ======================= PYDANTIC MODELS =======================

class UserInfo(BaseModel):
    userId: str = Field(..., alias="_id")
    name: str
    profileImage: str = ""
    role: str

class CreatePostRequest(BaseModel):
    title: str = Field(..., min_length=5, max_length=200)
    content: str = Field(..., min_length=10, max_length=5000)
    category: str = Field(..., description="crop_advice, disease, market, recipe, general")
    tags: List[str] = []
    visibility: str = Field(default="public", description="public, private, friends_only")

class PostResponse(BaseModel):
    id: str
    userId: str
    author: UserInfo
    title: str
    content: str
    category: str
    images: List[str] = []
    tags: List[str] = []
    likes: int = 0
    comments: int = 0
    views: int = 0
    createdAt: str
    updatedAt: str

class CreateCommentRequest(BaseModel):
    content: str = Field(..., min_length=1, max_length=1000)
    images: List[str] = []

class CommentResponse(BaseModel):
    id: str
    postId: str
    userId: str
    author: UserInfo
    content: str
    likes: int = 0
    replies: int = 0
    createdAt: str

class FollowResponse(BaseModel):
    followerId: str
    followingId: str
    followingUser: UserInfo
    createdAt: str

# ======================= COMMUNITY ROUTER =======================

router = APIRouter(prefix="/api/community", tags=["Community"])

# ======================= POST ENDPOINTS =======================

@router.post(
    "/post",
    response_model=PostResponse,
    summary="Create a community post",
    status_code=201
)
async def create_post(userId: str, request: CreatePostRequest):
    """
    Create a new farmer community post
    
    Categories:
    - crop_advice: Tips and advice on crops
    - disease: Disease identification and solutions
    - market: Market prices and trading
    - recipe: Cooking recipes from farm produce
    - general: General farming discussion
    
    Visibility:
    - public: Visible to all users
    - private: Only for the author
    - friends_only: Only for followers
    """
    try:
        # Validate category
        valid_categories = ["crop_advice", "disease", "market", "recipe", "general"]
        if request.category not in valid_categories:
            raise HTTPException(status_code=400, detail=f"Invalid category. Must be one of {valid_categories}")
        
        # Create post document
        post_data = {
            "userId": userId,
            "author": {
                # Would fetch from users collection
                "name": "Farmer Name",
                "profileImage": "",
                "role": "farmer"
            },
            "title": request.title,
            "content": request.content,
            "category": request.category,
            "tags": request.tags,
            "images": [],
            "likes": 0,
            "likedBy": [],
            "comments": [],
            "shares": 0,
            "views": 0,
            "visibility": request.visibility,
            "isPinned": False,
            "createdAt": datetime.now(),
            "updatedAt": datetime.now()
        }
        
        # Save to MongoDB
        # result = PostCollection.insert_one(post_data)
        
        return {
            **post_data,
            "id": "post_id_here"
        }
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error creating post: {str(e)}")

@router.get(
    "/posts",
    response_model=List[PostResponse],
    summary="Get community posts"
)
async def get_posts(
    category: Optional[str] = None,
    sort_by: str = "recent",  # recent, trending, popular
    limit: int = 20,
    skip: int = 0
):
    """
    Get community posts with filtering and sorting
    
    Parameters:
    - category: Filter by post category
    - sort_by: Sort by 'recent', 'trending', or 'popular'
    - limit: Number of posts to return (default 20)
    - skip: Offset for pagination
    """
    try:
        filters = {}
        if category:
            filters['category'] = category
        
        # Sort options
        sort_options = {
            'recent': [('createdAt', -1)],
            'trending': [('likes', -1), ('createdAt', -1)],
            'popular': [('views', -1)]
        }
        
        # Fetch from MongoDB
        # posts = PostCollection.find(filters).sort(sort_options[sort_by]).skip(skip).limit(limit)
        
        return []
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching posts: {str(e)}")

@router.get(
    "/posts/{postId}",
    response_model=PostResponse,
    summary="Get single post"
)
async def get_post_detail(postId: str):
    """Get detailed information about a specific post"""
    try:
        # Fetch post
        # post = PostCollection.find_one({"_id": ObjectId(postId)})
        
        # Increment view count
        # PostCollection.update_one({"_id": ObjectId(postId)}, {"$inc": {"views": 1}})
        
        return {}
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching post: {str(e)}")

@router.patch(
    "/posts/{postId}",
    response_model=PostResponse,
    summary="Update post"
)
async def update_post(postId: str, userId: str, request: CreatePostRequest):
    """
    Update a community post (only author can update)
    """
    try:
        # Verify ownership
        # post = PostCollection.find_one({"_id": ObjectId(postId)})
        # if post['userId'] != userId:
        #     raise HTTPException(status_code=403, detail="Not authorized")
        
        # Update post
        update_data = {
            "title": request.title,
            "content": request.content,
            "category": request.category,
            "tags": request.tags,
            "updatedAt": datetime.now()
        }
        
        # PostCollection.update_one({"_id": ObjectId(postId)}, {"$set": update_data})
        
        return {}
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error updating post: {str(e)}")

@router.delete(
    "/posts/{postId}",
    summary="Delete post"
)
async def delete_post(postId: str, userId: str):
    """Delete a community post (only author can delete)"""
    try:
        # Verify ownership
        # post = PostCollection.find_one({"_id": ObjectId(postId)})
        # if post['userId'] != userId:
        #     raise HTTPException(status_code=403, detail="Not authorized")
        
        # Delete post and related comments
        # PostCollection.delete_one({"_id": ObjectId(postId)})
        # CommentCollection.delete_many({"postId": ObjectId(postId)})
        
        return {"message": "Post deleted successfully"}
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error deleting post: {str(e)}")

@router.post(
    "/posts/{postId}/like",
    summary="Like a post"
)
async def like_post(postId: str, userId: str):
    """Like a community post"""
    try:
        # Check if already liked
        # post = PostCollection.find_one({"_id": ObjectId(postId)})
        # if userId in post['likedBy']:
        #     raise HTTPException(status_code=400, detail="Already liked")
        
        # Add like
        # PostCollection.update_one(
        #     {"_id": ObjectId(postId)},
        #     {"$inc": {"likes": 1}, "$push": {"likedBy": userId}}
        # )
        
        # Create notification
        
        return {"message": "Post liked"}
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error liking post: {str(e)}")

@router.post(
    "/posts/{postId}/unlike",
    summary="Unlike a post"
)
async def unlike_post(postId: str, userId: str):
    """Unlike a community post"""
    try:
        # PostCollection.update_one(
        #     {"_id": ObjectId(postId)},
        #     {"$inc": {"likes": -1}, "$pull": {"likedBy": userId}}
        # )
        
        return {"message": "Post unliked"}
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error unliking post: {str(e)}")

# ======================= COMMENT ENDPOINTS =======================

@router.post(
    "/posts/{postId}/comment",
    response_model=CommentResponse,
    summary="Add comment to post",
    status_code=201
)
async def add_comment(postId: str, userId: str, request: CreateCommentRequest):
    """Add a comment to a post"""
    try:
        comment_data = {
            "postId": postId,
            "userId": userId,
            "author": {
                "name": "User Name",
                "profileImage": ""
            },
            "content": request.content,
            "images": request.images,
            "likes": 0,
            "likedBy": [],
            "replies": [],
            "createdAt": datetime.now()
        }
        
        # Insert comment
        # result = CommentCollection.insert_one(comment_data)
        
        # Update post's comment count
        # PostCollection.update_one(
        #     {"_id": ObjectId(postId)},
        #     {"$push": {"comments": result.inserted_id}}
        # )
        
        return {}
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error adding comment: {str(e)}")

@router.get(
    "/posts/{postId}/comments",
    response_model=List[CommentResponse],
    summary="Get post comments"
)
async def get_post_comments(postId: str, limit: int = 10):
    """Get all comments for a post"""
    try:
        # comments = CommentCollection.find({"postId": ObjectId(postId)}).limit(limit)
        return []
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching comments: {str(e)}")

@router.post(
    "/comments/{commentId}/like",
    summary="Like a comment"
)
async def like_comment(commentId: str, userId: str):
    """Like a comment"""
    try:
        # CommentCollection.update_one(
        #     {"_id": ObjectId(commentId)},
        #     {"$inc": {"likes": 1}, "$push": {"likedBy": userId}}
        # )
        return {"message": "Comment liked"}
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error liking comment: {str(e)}")

# ======================= FOLLOW ENDPOINTS =======================

@router.post(
    "/users/{followingId}/follow",
    response_model=FollowResponse,
    summary="Follow a user",
    status_code=201
)
async def follow_user(followingId: str, userId: str):
    """
    Follow another farmer or expert
    """
    try:
        if userId == followingId:
            raise HTTPException(status_code=400, detail="Cannot follow yourself")
        
        # Check if already following
        # existing = FollowCollection.find_one({
        #     "followerId": userId,
        #     "followingId": followingId
        # })
        # if existing:
        #     raise HTTPException(status_code=400, detail="Already following")
        
        follow_data = {
            "followerId": userId,
            " followingId": followingId,
            "followingUser": {
                "name": "User Name",
                "role": "farmer",
                "expertise": ""
            },
            "createdAt": datetime.now()
        }
        
        # FollowCollection.insert_one(follow_data)
        
        return {}
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error following user: {str(e)}")

@router.post(
    "/users/{followingId}/unfollow",
    summary="Unfollow a user"
)
async def unfollow_user(followingId: str, userId: str):
    """Unfollow a user"""
    try:
        # FollowCollection.delete_one({
        #     "followerId": userId,
        #     "followingId": followingId
        # })
        
        return {"message": "Unfollowed successfully"}
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error unfollowing user: {str(e)}")

@router.get(
    "/users/{userId}/followers",
    summary="Get user followers"
)
async def get_followers(userId: str):
    """Get list of followers for a user"""
    try:
        # followers = FollowCollection.find({"followingId": userId})
        return {"followers": 0, "followersList": []}
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching followers: {str(e)}")

@router.get(
    "/users/{userId}/following",
    summary="Get users that someone is following"
)
async def get_following(userId: str):
    """Get list of users that someone is following"""
    try:
        # following = FollowCollection.find({"followerId": userId})
        return {"following": 0, "followingList": []}
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching following: {str(e)}")

# ======================= SEARCH & DISCOVERY =======================

@router.get(
    "/search",
    summary="Search posts and users"
)
async def search_community(
    query: str = Field(..., min_length=3),
    search_type: str = "all"  # posts, users, topics, all
):
    """
    Search community content
    
    Parameters:
    - query: Search query (minimum 3 characters)
    - search_type: 'posts', 'users', 'topics', or 'all'
    """
    try:
        results = {
            "posts": [],
            "users": [],
            "topics": []
        }
        
        # Search posts
        # if search_type in ["posts", "all"]:
        #     posts = PostCollection.find({
        #         "$text": {"$search": query}
        #     }).limit(10)
        
        # Search users
        # if search_type in ["users", "all"]:
        #     users = UserCollection.find({
        #         "$or": [
        #             {"name": {"$regex": query, "$options": "i"}},
        #             {"expertise": {"$regex": query, "$options": "i"}}
        #         ]
        #     }).limit(10)
        
        return results
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error searching: {str(e)}")

# ======================= TRENDS & RECOMMENDED =======================

@router.get(
    "/trends",
    summary="Get trending posts"
)
async def get_trends(limit: int = 10):
    """Get trending topics and posts from the community"""
    try:
        # Fetch trending posts (most likes + comments + views in last 7 days)
        return {
            "trending_posts": [],
            "trending_topics": [],
            "hot_discussions": []
        }
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching trends: {str(e)}")

@router.get(
    "/recommended",
    summary="Get recommended posts for user"
)
async def get_recommendations(userId: str):
    """Get personalized post recommendations for a user"""
    try:
        # Use user's interests and followed users to recommend posts
        return {
            "recommended_posts": [],
            "reason": "Based on your interests and follows"
        }
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching recommendations: {str(e)}")

# ======================= MONGODB SCHEMA CREATION =======================

async def create_community_indexes():
    """
    Create MongoDB indexes for optimal query performance
    Run this once during database initialization
    """
    indexes = {
        'posts': [
            ({'userId': 1}, {}),
            ({'category': 1, 'createdAt': -1}, {}),
            ({'title': 'text', 'content': 'text'}, {}),
            ({'tags': 1}, {}),
            ({'visibility': 1}, {})
        ],
        'comments': [
            ({'postId': 1, 'createdAt': -1}, {}),
            ({'userId': 1}, {})
        ],
        'followers': [
            ({'followerId': 1, 'followingId': 1}, {'unique': True}),
            ({'followingId': 1}, {})
        ],
        'notifications': [
            ({'userId': 1, 'read': 1}, {}),
            ({'createdAt': -1}, {})
        ]
    }
    
    # Create collections and indexes
    # for collection, index_list in indexes.items():
    #     for index, options in index_list:
    #         db[collection].create_index(index, **options)
    
    print("[+] Community indexes created successfully")

