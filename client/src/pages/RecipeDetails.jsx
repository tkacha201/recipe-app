import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, Link, useNavigate, useLocation } from "react-router-dom";
import { showSuccess, showError } from "../components/Toast";

const RecipeDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isCreator, setIsCreator] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [hasLiked, setHasLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [likeLoading, setLikeLoading] = useState(false);
  const [userId, setUserId] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [commentsLoading, setCommentsLoading] = useState(false);
  const [commentSubmitting, setCommentSubmitting] = useState(false);
  const [deleteCommentId, setDeleteCommentId] = useState(null);

  useEffect(() => {
    setLoading(true);
    const fetchRecipe = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/recipes/recipe/${id}`
        );
        setRecipe(response.data);
        setLikeCount(response.data.likes ? response.data.likes.length : 0);

        // Check if current user is the creator and if they've liked the recipe
        const token = localStorage.getItem("token");
        if (token) {
          try {
            const decodedToken = JSON.parse(atob(token.split(".")[1]));
            const currentUserId = decodedToken.userId;
            setUserId(currentUserId);

            // Check if this is the creator of the recipe
            setIsCreator(currentUserId === response.data.createdBy._id);

            // Check if user has liked this recipe
            if (response.data.likes) {
              const userLiked = response.data.likes.some(
                (like) => like._id === currentUserId || like === currentUserId
              );
              setHasLiked(userLiked);
            }
          } catch (error) {
            console.error("Error decoding token:", error);
          }
        }

        setLoading(false);
      } catch (err) {
        console.error("Error fetching recipe:", err);
        setError("Failed to load recipe. Please try again later.");
        setLoading(false);
      }
    };

    fetchRecipe();
    fetchComments();
  }, [id, location.key]);

  const fetchComments = async () => {
    setCommentsLoading(true);
    try {
      const response = await axios.get(
        `http://localhost:5000/api/comments/${id}`
      );
      setComments(response.data);
    } catch (err) {
      console.error("Error fetching comments:", err);
      // Not showing error to user for comments as it's not critical
    } finally {
      setCommentsLoading(false);
    }
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();

    if (!newComment.trim()) return;

    const token = localStorage.getItem("token");
    if (!token) {
      showError("You must be logged in to comment");
      return;
    }

    setCommentSubmitting(true);
    try {
      const response = await axios.post(
        "http://localhost:5000/api/comments",
        {
          text: newComment,
          recipeId: id,
        },
        {
          headers: {
            "x-auth-token": token,
          },
        }
      );

      // Add the new comment to the comments array
      setComments([response.data, ...comments]);
      setNewComment("");
      showSuccess("Comment added successfully");
    } catch (err) {
      console.error("Error adding comment:", err);
      showError("Failed to add comment. Please try again.");
    } finally {
      setCommentSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this recipe?")) {
      return;
    }

    setDeleteLoading(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("You must be logged in to delete a recipe.");
        setDeleteLoading(false);
        return;
      }

      await axios.delete(`http://localhost:5000/api/recipes/delete/${id}`, {
        headers: {
          "x-auth-token": token,
        },
      });

      navigate("/recipes");
    } catch (err) {
      console.error("Error deleting recipe:", err);
      setError("Failed to delete recipe. Please try again.");
      setDeleteLoading(false);
    }
  };

  const handleLike = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      showError("You must be logged in to like recipes");
      return;
    }

    setLikeLoading(true);
    try {
      const endpoint = hasLiked ? "unlike" : "like";
      const response = await axios.put(
        `http://localhost:5000/api/recipes/${endpoint}/${id}`,
        {},
        {
          headers: {
            "x-auth-token": token,
          },
        }
      );

      setHasLiked(!hasLiked);
      setLikeCount(response.data.length);
      showSuccess(hasLiked ? "Recipe unliked" : "Recipe liked");
    } catch (err) {
      console.error("Error liking/unliking recipe:", err);
      showError("Failed to update like status. Please try again.");
    } finally {
      setLikeLoading(false);
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (!window.confirm("Are you sure you want to delete this comment?")) {
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      showError("You must be logged in to delete a comment");
      return;
    }

    setDeleteCommentId(commentId);
    try {
      await axios.delete(`http://localhost:5000/api/comments/${commentId}`, {
        headers: {
          "x-auth-token": token,
        },
      });

      // Remove the deleted comment from the comments array
      setComments(comments.filter((comment) => comment._id !== commentId));
      showSuccess("Comment deleted successfully");
    } catch (err) {
      console.error("Error deleting comment:", err);
      showError("Failed to delete comment. Please try again.");
    } finally {
      setDeleteCommentId(null);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-teal-500"></div>
          <p className="mt-2 text-gray-600">Loading recipe...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="text-center">
          <p className="text-red-500">{error}</p>
          <Link to="/recipes" className="text-teal-500 mt-4 inline-block">
            Back to recipes
          </Link>
        </div>
      </div>
    );
  }

  if (!recipe) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="text-center">
          <p className="text-gray-500">Recipe not found.</p>
          <Link to="/recipes" className="text-teal-500 mt-4 inline-block">
            Back to recipes
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="relative h-96 lg:h-[500px]">
          <img
            src={recipe.imageUrl}
            alt={recipe.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black opacity-50"></div>
          <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-4xl font-bold mb-2">{recipe.title}</h1>
                <p className="text-lg">
                  By {recipe.createdBy?.name || "Unknown"}
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={handleLike}
                  disabled={likeLoading}
                  className={`flex items-center space-x-1 px-4 py-2 rounded-full ${
                    hasLiked
                      ? "bg-red-500 hover:bg-red-600"
                      : "bg-white text-gray-800 hover:bg-gray-100"
                  } transition-colors`}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill={hasLiked ? "white" : "currentColor"}
                  >
                    <path
                      fillRule="evenodd"
                      d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span>{likeCount}</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="p-6 md:p-8 lg:p-10">
          {isCreator && (
            <div className="flex space-x-4 mb-8">
              <Link
                to={`/edit-recipe/${id}`}
                className="bg-teal-500 text-white px-4 py-2 rounded hover:bg-teal-600 transition-colors"
              >
                Edit Recipe
              </Link>
              <button
                onClick={handleDelete}
                disabled={deleteLoading}
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition-colors"
              >
                {deleteLoading ? "Deleting..." : "Delete Recipe"}
              </button>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 lg:gap-12">
            <div className="lg:col-span-1">
              <div className="bg-gray-50 rounded-lg p-6">
                <h2 className="text-2xl font-bold mb-4">Ingredients</h2>
                <ul className="space-y-2">
                  {recipe.ingredients.map((ingredient, index) => (
                    <li key={index} className="flex items-start">
                      <span className="inline-block h-5 w-5 rounded-full bg-teal-500 text-white text-center text-xs mr-2 flex-shrink-0 mt-0.5">
                        ✓
                      </span>
                      <span>{ingredient}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="lg:col-span-3">
              <h2 className="text-2xl font-bold mb-4">Instructions</h2>
              <div className="prose prose-lg max-w-none">
                <p className="whitespace-pre-line">{recipe.instructions}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Comments Section */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden mt-8">
        <div className="p-6 md:p-8 lg:p-10">
          <h2 className="text-2xl font-bold mb-6">Comments</h2>

          {/* Comment Form */}
          <form onSubmit={handleCommentSubmit} className="mb-8">
            <div className="flex flex-col space-y-4">
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Add a comment..."
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                rows="3"
                required
              />
              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={commentSubmitting || !newComment.trim()}
                  className="bg-teal-500 text-white px-4 py-2 rounded hover:bg-teal-600 transition-colors disabled:opacity-50"
                >
                  {commentSubmitting ? "Posting..." : "Post Comment"}
                </button>
              </div>
            </div>
          </form>

          {/* Comments List */}
          <div className="space-y-6">
            {commentsLoading ? (
              <div className="text-center py-4">
                <div className="inline-block animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-teal-500"></div>
                <p className="text-gray-500 mt-2">Loading comments...</p>
              </div>
            ) : comments.length > 0 ? (
              comments.map((comment) => (
                <div
                  key={comment._id}
                  className="border-b border-gray-200 pb-4 mb-4 last:border-0"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="font-medium">
                        {comment.userId?.name || "Anonymous"}
                      </div>
                      <div className="text-gray-500 text-sm">
                        {new Date(comment.createdAt).toLocaleDateString()} at{" "}
                        {new Date(comment.createdAt).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </div>
                    </div>
                    {userId === comment.userId?._id && (
                      <button
                        onClick={() => handleDeleteComment(comment._id)}
                        disabled={deleteCommentId === comment._id}
                        className="text-gray-400 hover:text-red-500 text-sm"
                      >
                        {deleteCommentId === comment._id ? (
                          <span>Deleting...</span>
                        ) : (
                          <span>Delete</span>
                        )}
                      </button>
                    )}
                  </div>
                  <p className="mt-2 text-gray-700">{comment.text}</p>
                </div>
              ))
            ) : (
              <p className="text-center text-gray-500 py-4">
                No comments yet. Be the first to comment!
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecipeDetails;
