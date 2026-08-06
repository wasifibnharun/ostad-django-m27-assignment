import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { useWatchlist } from "../../contexts/watchlist/useWatchList";
import { charactersUrl } from "../../api/endpoints";
import { useRecentlyViewed } from "../../hooks/useRecentlyViewed";
import Skeleton from "../ui/Skeleton";

export default function WatchlistPanel() {
  const { watchlistIds, removeFromWatchlist, clearWatchlist } = useWatchlist();
  const { recent } = useRecentlyViewed();

  const { data, isPending } = useQuery({
    queryKey: ["watchlist", watchlistIds.join(",")],
    queryFn: () => fetch(charactersUrl(watchlistIds)).then((res) => res.json()),
    enabled: watchlistIds.length > 0,
    staleTime: 5 * 60 * 1000,
  });

  const characters = Array.isArray(data) ? data : data ? [data] : [];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
      {/* Watchlist Section */}
      <div
        style={{
          backgroundColor: "#FFFFFF",
          padding: "20px",
          borderRadius: "14px",
          border: "1px solid #E2E8F0",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "16px",
          }}
        >
          <h3
            style={{
              margin: 0,
              fontSize: "16px",
              fontWeight: "700",
              color: "#0F172A",
            }}
          >
            Watchlist
          </h3>
          {watchlistIds.length > 0 && (
            <button
              onClick={clearWatchlist}
              style={{
                background: "none",
                border: "none",
                color: "#4F46E5",
                fontSize: "13px",
                cursor: "pointer",
                fontWeight: "600",
              }}
            >
              Clear all
            </button>
          )}
        </div>

        {watchlistIds.length === 0 ? (
          <p style={{ fontSize: "13px", color: "#64748B", margin: 0 }}>
            Empty. Add characters to keep track of them.
          </p>
        ) : isPending ? (
          <div
            style={{ display: "flex", flexDirection: "column", gap: "12px" }}
          >
            <Skeleton height="32px" />
            <Skeleton height="32px" />
          </div>
        ) : (
          <div
            style={{ display: "flex", flexDirection: "column", gap: "12px" }}
          >
            {characters.map((char) => (
              <div
                key={char.id}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  paddingBottom: "12px",
                  borderBottom: "1px solid #F1F5F9",
                }}
              >
                <img
                  src={char.image}
                  alt={char.name}
                  style={{
                    width: "32px",
                    height: "32px",
                    borderRadius: "8px",
                    objectFit: "cover",
                  }}
                />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div
                    style={{
                      fontSize: "14px",
                      fontWeight: "600",
                      color: "#0F172A",
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {char.name}
                  </div>
                  <div style={{ fontSize: "12px", color: "#64748B" }}>
                    {char.species} · {char.status}
                  </div>
                </div>
                <button
                  onClick={() => removeFromWatchlist(char.id)}
                  style={{
                    background: "none",
                    border: "none",
                    color: "#DC2626",
                    fontSize: "16px",
                    cursor: "pointer",
                    padding: "4px",
                  }}
                  title="Remove"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Recently Viewed Section */}
      <div
        style={{
          backgroundColor: "#FFFFFF",
          padding: "20px",
          borderRadius: "14px",
          border: "1px solid #E2E8F0",
        }}
      >
        <h3
          style={{
            margin: "0 0 16px 0",
            fontSize: "16px",
            fontWeight: "700",
            color: "#0F172A",
          }}
        >
          Recently viewed
        </h3>
        {recent.length === 0 ? (
          <p style={{ fontSize: "13px", color: "#64748B", margin: 0 }}>
            No characters viewed yet.
          </p>
        ) : (
          <div
            style={{ display: "flex", flexDirection: "column", gap: "12px" }}
          >
            {recent.map((char) => (
              <Link
                to={`/characters/${char.id}`}
                key={char.id}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  textDecoration: "none",
                }}
              >
                <img
                  src={char.image}
                  alt={char.name}
                  style={{
                    width: "32px",
                    height: "32px",
                    borderRadius: "8px",
                    objectFit: "cover",
                  }}
                />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div
                    style={{
                      fontSize: "14px",
                      fontWeight: "600",
                      color: "#0F172A",
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {char.name}
                  </div>
                  <div style={{ fontSize: "12px", color: "#64748B" }}>
                    Character · {char.status}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
