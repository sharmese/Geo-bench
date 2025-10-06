const ProductCard: React.FC<{
  title: string;
  description: string;
  location: { type: string; coordinates: number[] };
  createdAt?: string;
  userId?: number;
  markerId?: number;
  imageUrl?: string;
  username: string;
}> = ({
  title,
  description,
  location,
  createdAt,
  userId,
  markerId,
  imageUrl,
  username,
}) => {
  return (
    <div className='max-w-md mx-auto bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md'>
      <h2 className='text-2xl font-bold mb-4 text-gray-800 dark:text-gray-200'>
        {title}
      </h2>
      <p className='text-gray-600 dark:text-gray-400 mb-4'>{description}</p>
      {imageUrl && (
        <img
          src={imageUrl}
          alt={title}
          className='w-full h-48 object-cover rounded-md mb-4'
        />
      )}
      <div className='mt-4'>
        <span className='text-gray-600 dark:text-gray-400'>
          Posted by: {username}
        </span>
      </div>
    </div>
  );
};

export default ProductCard;
