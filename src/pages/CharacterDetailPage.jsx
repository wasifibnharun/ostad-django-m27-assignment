import { useParams, useNavigate, Link } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useCharacter } from "../hooks/useCharacter";
import { useWatchlist } from "../contexts/watchlist/useWatchList";
import { charactersUrl, episodesUrl } from "../api/endpoints";
import { useEffect } from 'react';
import { useRecentlyViewed } from '../hooks/useRecentlyViewed';
import Button from "../components/ui/Button";
import Badge from "../components/ui/Badge";
import Skeleton from "../components/ui/Skeleton";

export default function CharacterDetailPage() {
  // [REQ-12] useParams: the character id is read from the URL, so /characters/42 works on a hard refresh
  const { id } = useParams();

  // [REQ-12] useNavigate: programmatic navigation for the Back button
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { watchlistIds, toggleWatchlist } = useWatchlist();
  const isInWatchlist = watchlistIds.includes(Number(id));

  // Fetch Main Character Data
  const { data: character, isPending, isError } = useCharacter(id);

  // Extract episode IDs for the batch request
  const episodeIds =
    character?.episode?.map((url) => url.split("/").pop()) || [];

  // Fetch Episode Appearances (Batch Endpoint)
  const { data: episodesData, isLoading: episodesLoading } = useQuery({
    queryKey: ["episodes", episodeIds.join(",")],
    queryFn: () => fetch(episodesUrl(episodeIds)).then((res) => res.json()),
    enabled: episodeIds.length > 0,
    staleTime: 5 * 60 * 1000,
  });

  // Fetch Related Characters (Dynamic slice for demonstration)
  const relatedIds = [Number(id) + 1, Number(id) + 2, Number(id) + 3].filter(
    (n) => n <= 826,
  );
  const { data: relatedCharacters } = useQuery({
    queryKey: ["characters", "related", relatedIds.join(",")],
    queryFn: () => fetch(charactersUrl(relatedIds)).then((res) => res.json()),
    enabled: relatedIds.length > 0,
    staleTime: 5 * 60 * 1000,
  });

  // Normalize episode data (API returns an object if only 1 ID, array if multiple)
  const episodes = Array.isArray(episodesData)
    ? episodesData
    : episodesData
      ? [episodesData]
      : [];
  const related = Array.isArray(relatedCharacters)
    ? relatedCharacters
    : relatedCharacters
      ? [relatedCharacters]
      : [];

  // Query Inspector States
  const charQueryState = queryClient.getQueryState(["character", id]);
  const epQueryState = queryClient.getQueryState([
    "episodes",
    episodeIds.join(","),
  ]);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    alert("Link copied to clipboard!");
  };

  const formatDate = (isoString) => {
    return new Date(isoString).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const { addRecent } = useRecentlyViewed();
  useEffect(() => {
    if (character && !character.error) addRecent(character);
  }, [character, addRecent]);

  // [REQ-19] 404 / Error Handling for Invalid Route Parameter
  if (isError || (character && character.error)) {
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
        <div style={{ fontSize: "48px", marginBottom: "16px" }}>🚫</div>
        <h3
          style={{
            fontSize: "18px",
            fontWeight: "700",
            color: "#DC2626",
            marginBottom: "8px",
          }}
        >
          Invalid route parameter
        </h3>
        <p style={{ fontSize: "14px", color: "#64748B", marginBottom: "24px" }}>
          Character #{id} was not found.
        </p>
        <Button onClick={() => navigate(-1)}>← Go back</Button>
      </div>
    );
  }

  if (isPending) {
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
        <Skeleton height="300px" />
        <Skeleton height="200px" />
      </div>
    );
  }

  return (
    <div style={{ display: "flex", gap: "24px", flexDirection: "column" }}>
      {/* Top Action Bar */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          {/* [REQ-12] navigate(-1) for Back button */}
          <Button variant="secondary" onClick={() => navigate(-1)}>
            ← Back
          </Button>
          <div style={{ fontSize: "14px", color: "#64748B" }}>
            <Link to="/" style={{ color: "#64748B", textDecoration: "none" }}>
              Explore
            </Link>{" "}
            ›
            <Link
              to="/characters"
              style={{
                color: "#64748B",
                textDecoration: "none",
                marginLeft: "6px",
              }}
            >
              Characters
            </Link>{" "}
            ›
            <span
              style={{ color: "#0F172A", fontWeight: "600", marginLeft: "6px" }}
            >
              {character.name}
            </span>
          </div>
        </div>
        <div style={{ display: "flex", gap: "12px" }}>
          <Button variant="secondary" onClick={handleCopyLink}>
            🔗 Copy link
          </Button>
          <Button
            variant={isInWatchlist ? "secondary" : "primary"}
            onClick={() => toggleWatchlist(character.id)}
          >
            {isInWatchlist ? "★ In watchlist" : "☆ Add to watchlist"}
          </Button>
        </div>
      </div>

      <div style={{ display: "flex", gap: "24px", alignItems: "flex-start" }}>
        {/* Main Left Column */}
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            gap: "24px",
          }}
        >
          {/* Hero Card */}
          <div
            style={{
              display: "flex",
              gap: "24px",
              backgroundColor: "#FFFFFF",
              padding: "24px",
              borderRadius: "14px",
              border: "1px solid #E2E8F0",
            }}
          >
            <div
              style={{
                width: "200px",
                height: "200px",
                borderRadius: "14px",
                overflow: "hidden",
                flexShrink: 0,
                backgroundColor: "#EEF2FF",
              }}
            >
              <img
                src={character.image}
                alt={character.name}
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            </div>
            <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  marginBottom: "8px",
                }}
              >
                <h1
                  style={{
                    margin: 0,
                    fontSize: "28px",
                    fontWeight: "700",
                    color: "#0F172A",
                  }}
                >
                  {character.name}
                </h1>
                <Badge status={character.status} />
                <Badge text={`ID #${character.id}`} />
              </div>
              <p
                style={{
                  margin: "0 0 24px 0",
                  fontSize: "14px",
                  color: "#64748B",
                }}
              >
                {character.species} · {character.gender} · appears in{" "}
                {episodeIds.length} episodes
              </p>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(3, 1fr)",
                  gap: "20px",
                  marginTop: "auto",
                }}
              >
                <div>
                  <div
                    style={{
                      fontSize: "11px",
                      fontWeight: "700",
                      color: "#64748B",
                      textTransform: "uppercase",
                      marginBottom: "4px",
                    }}
                  >
                    Species
                  </div>
                  <div
                    style={{
                      fontSize: "14px",
                      fontWeight: "600",
                      color: "#0F172A",
                    }}
                  >
                    {character.species}
                  </div>
                </div>
                <div>
                  <div
                    style={{
                      fontSize: "11px",
                      fontWeight: "700",
                      color: "#64748B",
                      textTransform: "uppercase",
                      marginBottom: "4px",
                    }}
                  >
                    Gender
                  </div>
                  <div
                    style={{
                      fontSize: "14px",
                      fontWeight: "600",
                      color: "#0F172A",
                    }}
                  >
                    {character.gender}
                  </div>
                </div>
                <div>
                  <div
                    style={{
                      fontSize: "11px",
                      fontWeight: "700",
                      color: "#64748B",
                      textTransform: "uppercase",
                      marginBottom: "4px",
                    }}
                  >
                    Origin
                  </div>
                  <div
                    style={{
                      fontSize: "14px",
                      fontWeight: "600",
                      color: "#4F46E5",
                    }}
                  >
                    {character.origin.name !== "unknown" ? (
                      <Link
                        to={`/locations?name=${character.origin.name}`}
                        style={{ color: "#4F46E5", textDecoration: "none" }}
                      >
                        {character.origin.name} →
                      </Link>
                    ) : (
                      "Unknown"
                    )}
                  </div>
                </div>
                <div>
                  <div
                    style={{
                      fontSize: "11px",
                      fontWeight: "700",
                      color: "#64748B",
                      textTransform: "uppercase",
                      marginBottom: "4px",
                    }}
                  >
                    Type
                  </div>
                  <div
                    style={{
                      fontSize: "14px",
                      fontWeight: "600",
                      color: "#0F172A",
                    }}
                  >
                    {character.type || "—"}
                  </div>
                </div>
                <div>
                  <div
                    style={{
                      fontSize: "11px",
                      fontWeight: "700",
                      color: "#64748B",
                      textTransform: "uppercase",
                      marginBottom: "4px",
                    }}
                  >
                    Created
                  </div>
                  <div
                    style={{
                      fontSize: "14px",
                      fontWeight: "600",
                      color: "#0F172A",
                    }}
                  >
                    {formatDate(character.created)}
                  </div>
                </div>
                <div>
                  <div
                    style={{
                      fontSize: "11px",
                      fontWeight: "700",
                      color: "#64748B",
                      textTransform: "uppercase",
                      marginBottom: "4px",
                    }}
                  >
                    Last Location
                  </div>
                  <div
                    style={{
                      fontSize: "14px",
                      fontWeight: "600",
                      color: "#4F46E5",
                    }}
                  >
                    {character.location.name !== "unknown" ? (
                      <Link
                        to={`/locations?name=${character.location.name}`}
                        style={{ color: "#4F46E5", textDecoration: "none" }}
                      >
                        {character.location.name} →
                      </Link>
                    ) : (
                      "Unknown"
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Episode Appearances */}
          <div
            style={{
              backgroundColor: "#FFFFFF",
              padding: "24px",
              borderRadius: "14px",
              border: "1px solid #E2E8F0",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "20px",
              }}
            >
              <div
                style={{ display: "flex", alignItems: "center", gap: "12px" }}
              >
                <h2
                  style={{
                    margin: 0,
                    fontSize: "18px",
                    fontWeight: "700",
                    color: "#0F172A",
                  }}
                >
                  Episode appearances
                </h2>
                {episodesLoading && (
                  <Badge
                    status="refetching"
                    text={`loading ${episodeIds.length} episodes...`}
                  />
                )}
              </div>
              <Button
                variant="secondary"
                style={{ height: "32px", fontSize: "13px" }}
              >
                Show all
              </Button>
            </div>

            <div
              style={{ display: "flex", flexDirection: "column", gap: "12px" }}
            >
              {episodes.slice(0, 5).map((ep) => (
                <div
                  key={ep.id}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    paddingBottom: "12px",
                    borderBottom: "1px solid #F1F5F9",
                  }}
                >
                  <div style={{ display: "flex", gap: "16px" }}>
                    <span
                      style={{
                        fontWeight: "600",
                        color: "#4F46E5",
                        fontSize: "14px",
                        width: "60px",
                      }}
                    >
                      {ep.episode}
                    </span>
                    <span style={{ color: "#0F172A", fontSize: "14px" }}>
                      {ep.name}
                    </span>
                  </div>
                  <span style={{ color: "#64748B", fontSize: "13px" }}>
                    {ep.air_date}
                  </span>
                </div>
              ))}
              {episodes.length > 5 && (
                <div
                  style={{
                    textAlign: "center",
                    padding: "12px 0",
                    color: "#64748B",
                    fontSize: "13px",
                  }}
                >
                  + {episodes.length - 5} more episodes
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Rail */}
        <div
          style={{
            width: "320px",
            flexShrink: 0,
            display: "flex",
            flexDirection: "column",
            gap: "24px",
          }}
        >
          {/* Query Inspector */}
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
              Query inspector
            </h3>
            <p
              style={{
                margin: "0 0 16px 0",
                fontSize: "13px",
                color: "#64748B",
              }}
            >
              This panel is required: it proves the detail data came from the
              cache when you navigate back and forth.
            </p>
            <div
              style={{ display: "flex", flexDirection: "column", gap: "12px" }}
            >
              <div
                style={{ display: "flex", alignItems: "center", gap: "12px" }}
              >
                <Badge
                  status={
                    charQueryState?.status === "success" ? "alive" : "unknown"
                  }
                  text={charQueryState?.status}
                />
                <code style={{ fontSize: "12px", color: "#475569" }}>
                  ['character', '{id}']
                </code>
              </div>
              <div
                style={{ display: "flex", alignItems: "center", gap: "12px" }}
              >
                <Badge
                  status={
                    epQueryState?.fetchStatus === "fetching"
                      ? "refetching"
                      : epQueryState?.status === "success"
                        ? "alive"
                        : "unknown"
                  }
                  text={
                    epQueryState?.fetchStatus === "fetching"
                      ? "fetching"
                      : epQueryState?.status
                  }
                />
                <code style={{ fontSize: "12px", color: "#475569" }}>
                  ['episodes', '...']
                </code>
              </div>
            </div>
          </div>

          {/* Related Characters */}
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
              Related characters
            </h3>
            <div
              style={{ display: "flex", flexDirection: "column", gap: "16px" }}
            >
              {related.map((rel) => (
                <Link
                  to={`/characters/${rel.id}`}
                  key={rel.id}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "12px",
                    textDecoration: "none",
                  }}
                >
                  <img
                    src={rel.image}
                    alt={rel.name}
                    style={{
                      width: "40px",
                      height: "40px",
                      borderRadius: "8px",
                      objectFit: "cover",
                    }}
                  />
                  <div style={{ flex: 1 }}>
                    <div
                      style={{
                        fontSize: "14px",
                        fontWeight: "600",
                        color: "#0F172A",
                      }}
                    >
                      {rel.name}
                    </div>
                    <div style={{ fontSize: "12px", color: "#64748B" }}>
                      {rel.species} · {rel.status}
                    </div>
                  </div>
                  <span style={{ color: "#4F46E5" }}>→</span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
