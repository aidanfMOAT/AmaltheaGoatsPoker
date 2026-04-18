function fmtDate(dateStr) {
  return new Date(dateStr).toLocaleDateString('en-GB', {
    day: 'numeric', month: 'long', year: 'numeric',
  });
}

export default function BlogList({ gameNights, onViewPost }) {
  const posts = [...gameNights]
    .filter(n => n.blogPost)
    .sort((a, b) => b.date.localeCompare(a.date));

  return (
    <div>
      <div className="list-header">
        <h2>Game Night Reports</h2>
      </div>
      {posts.length === 0 && (
        <div className="card">
          <p className="empty-msg">No reports written yet. Head to Game Nights and click &ldquo;Write Report&rdquo; on a night.</p>
        </div>
      )}
      {posts.map(night => (
        <div
          key={night.id}
          className="card blog-list-card"
          onClick={() => onViewPost(night.id)}
        >
          <div className="blog-list-date">{fmtDate(night.date)}</div>
          <h3 className="blog-list-title">{night.blogPost.title}</h3>
          {night.blogPost.body && (
            <p className="blog-list-excerpt">
              {night.blogPost.body.slice(0, 200)}
              {night.blogPost.body.length > 200 ? '…' : ''}
            </p>
          )}
          <span className="blog-read-more">Read full report →</span>
        </div>
      ))}
    </div>
  );
}
