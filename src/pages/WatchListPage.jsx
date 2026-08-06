import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import {
  useWatchlistState,
  useWatchlistActions,
} from "../contexts/watchlist/useWatchList";
import { charactersUrl } from "../api/endpoints";
import CharacterCard from "../components/characters/CharacterCard";
import Skeleton from "../components/ui/Skeleton";
import Button from "../components/ui/Button";
import ErrorState from "../components/stats/ErrorState";

export default function WatchlistPage() {
  // [REQ-17] Co-located state vs global state: Watchlist IDs live in Context (global)
  const { watchlistIds } = useWatchlistState();
  const { clearWatchlist } = useWatchlistActions();

  // The API requires a comma-separated list of IDs.
  // It returns ONE object if there's only 1 ID, and an ARRAY if there are multiple.
  const { data, isPending, isError, error } = useQuery({
    queryKey: ["watchlist", watchlistIds.join(",")],
    queryFn: () => fetch(charactersUrl(watchlistIds)).then((res) => res.json()),
    // Only fire the request if we actually have items in the watchlist
    enabled: watchlistIds.length > 0,
    staleTime: 5 * 60 * 1000,
  });

  // Normalize data into an array
  const characters = Array.isArray(data) ? data : data ? [data] : [];

  if (watchlistIds.length === 0) {
    return (
      <div
        style={{
          padding: "48px 24px",
          textAlign: "center",
          backgroundColor: "#FFFFFF",
          borderRadius: "14px",
          border: "1px solid #E2E8F0",
        }}
      >
        <div style={{ fontSize: "48px", marginBottom: "16px" }}>⭐</div>
        <h3
          style={{
            fontSize: "18px",
            fontWeight: "700",
            color: "#0F172A",
            marginBottom: "8px",
          }}
        >
          Your watchlist is empty
        </h3>
        <p style={{ fontSize: "14px", color: "#64748B", marginBottom: "24px" }}>
          Open any character and press the star icon to save it here.
        </p>
        <Link to="/characters" style={{ textDecoration: "none" }}>
          <Button>Browse characters</Button>
        </Link>
      </div>
    );
  }

  return (
    <div>
      <div
        style={{
          marginBottom: "24px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-end",
        }}
      >
        <div>
          <h1
            style={{
              fontSize: "24px",
              fontWeight: "700",
              color: "#0F172A",
              margin: "0 0 4px 0",
            }}
          >
            Watchlist
          </h1>
          <p style={{ margin: 0, fontSize: "14px", color: "#64748B" }}>
            {watchlistIds.length} characters saved to your personal list.
          </p>
        </div>
        <Button variant="danger" onClick={clearWatchlist}>
          Clear all
        </Button>
      </div>

      {isPending ? (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
            gap: "16px",
          }}
        >
          {Array.from({ length: watchlistIds.length }).map((_, i) => (
            <Skeleton key={i} height="280px" />
          ))}
        </div>
      ) : isError ? (
        <ErrorState error={error} />
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
            gap: "16px",
          }}
        >
          {characters.map((char) => (
            <CharacterCard key={char.id} character={char} />
          ))}
        </div>
      )}
    </div>
  );
}
