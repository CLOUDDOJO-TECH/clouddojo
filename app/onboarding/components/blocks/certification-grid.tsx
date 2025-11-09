"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { certifications, Certification } from "../data/certifications_data";
import { CertificationBadge } from "./certification-badge";
import { Search, ChevronDown, ChevronUp } from "lucide-react";

interface CertificationGridProps {
  selectedCertifications: string[];
  onSelectionChange: (certificationIds: string[]) => void;
}

export function CertificationGrid({
  selectedCertifications,
  onSelectionChange,
}: CertificationGridProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [showAll, setShowAll] = useState(false);
  const [showAutocomplete, setShowAutocomplete] = useState(false);
  const [selectedProviders, setSelectedProviders] = useState<string[]>([]);

  // Custom order for display
  const orderedCertifications = useMemo(() => {
    const priorityOrder = [
      "aws-cloud-practitioner",
      "aws-solutions-architect",
      "aws-machine-learning-associate",
    ];

    const priority: Certification[] = [];
    const gcpCerts: Certification[] = [];
    const oracleCerts: Certification[] = [];
    const remaining: Certification[] = [];

    certifications.forEach((cert) => {
      if (priorityOrder.includes(cert.id)) {
        priority.push(cert);
      } else if (cert.provider === "gcp") {
        gcpCerts.push(cert);
      } else if (cert.provider === "oracle") {
        oracleCerts.push(cert);
      } else {
        remaining.push(cert);
      }
    });

    // Sort priority by the order specified
    priority.sort(
      (a, b) => priorityOrder.indexOf(a.id) - priorityOrder.indexOf(b.id),
    );

    // Take first GCP cert
    const firstGcp = gcpCerts.slice(0, 1);

    // Combine: priority (3) + first gcp (1) + oracle (1) + remaining
    return [
      ...priority,
      ...firstGcp,
      ...oracleCerts,
      ...remaining,
      ...gcpCerts.slice(1),
    ];
  }, []);

  // Filter certifications based on search query and providers
  const filteredCertifications = useMemo(() => {
    let filtered = orderedCertifications;

    // Filter by provider if any selected
    if (selectedProviders.length > 0) {
      filtered = filtered.filter((cert) =>
        selectedProviders.includes(cert.provider),
      );
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (cert) =>
          cert.name.toLowerCase().includes(query) ||
          cert.description.toLowerCase().includes(query) ||
          cert.provider.toLowerCase().includes(query),
      );
    }

    return filtered;
  }, [searchQuery, orderedCertifications, selectedProviders]);

  // Get autocomplete suggestions
  const autocompleteSuggestions = useMemo(() => {
    if (!searchQuery.trim() || searchQuery.length < 2) {
      return [];
    }

    const query = searchQuery.toLowerCase();
    return certifications
      .filter((cert) => cert.name.toLowerCase().includes(query))
      .slice(0, 5);
  }, [searchQuery]);

  // Calculate number of certifications to display
  const COLUMNS = 3;
  const ROWS_TO_SHOW = 3;
  const maxToShow = COLUMNS * ROWS_TO_SHOW;
  const displayedCertifications = showAll
    ? filteredCertifications
    : filteredCertifications.slice(0, maxToShow);
  const hasMore = filteredCertifications.length > maxToShow;

  const handleSelect = (certificationId: string) => {
    if (selectedCertifications.includes(certificationId)) {
      onSelectionChange(
        selectedCertifications.filter((id) => id !== certificationId),
      );
    } else {
      onSelectionChange([...selectedCertifications, certificationId]);
    }
  };

  const handleAutocompleteSelect = (cert: Certification) => {
    setSearchQuery(cert.name);
    setShowAutocomplete(false);
  };

  const toggleProvider = (provider: string) => {
    setSelectedProviders((prev) =>
      prev.includes(provider)
        ? prev.filter((p) => p !== provider)
        : [...prev, provider],
    );
  };

  const providers = [
    {
      id: "aws",
      label: "AWS",
      color:
        "bg-orange-500/20 text-orange-700 dark:text-orange-400 border-orange-500/50",
    },
    {
      id: "gcp",
      label: "GCP",
      color:
        "bg-blue-500/20 text-blue-700 dark:text-blue-400 border-blue-500/50",
    },
    {
      id: "oracle",
      label: "Oracle",
      color: "bg-red-500/20 text-red-700 dark:text-red-400 border-red-500/50",
    },
  ];

  return (
    <div className="w-full space-y-4">
      {/* Search Input */}
      <div className="relative">
        <div className="relative flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-gray-500 z-10 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setShowAutocomplete(true);
              }}
              onFocus={() => setShowAutocomplete(true)}
              onBlur={() => {
                // Delay to allow click on autocomplete item
                setTimeout(() => setShowAutocomplete(false), 200);
              }}
              placeholder="Search certifications..."
              className="w-full pl-10 pr-4 py-3 rounded-lg border-2
                       bg-white/20 dark:bg-white/5 backdrop-blur-sm
                       border-gray-300/50 dark:border-gray-600/50
                       text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-400
                       focus:border-blue-500/70 dark:focus:border-blue-400/70 focus:bg-white/30 dark:focus:bg-white/10
                       focus:outline-none transition-all duration-200"
            />
          </div>

          {/* Provider Filter Chips - Desktop */}
          <div className="hidden sm:flex gap-2 items-center">
            {providers.map((provider) => (
              <button
                key={provider.id}
                onClick={() => toggleProvider(provider.id)}
                className={`
                  px-3 py-2 rounded-full text-xs font-medium border transition-all duration-200 whitespace-nowrap
                  ${
                    selectedProviders.includes(provider.id)
                      ? provider.color
                      : "bg-white/20 dark:bg-white/5 text-gray-600 dark:text-gray-400 border-gray-300/50 dark:border-gray-600/50 backdrop-blur-sm"
                  }
                  hover:scale-105 active:scale-95
                `}
              >
                {provider.label}
              </button>
            ))}
          </div>
        </div>

        {/* Provider Filter Chips - Mobile */}
        <div className="flex sm:hidden gap-2 flex-wrap mt-2">
          {providers.map((provider) => (
            <button
              key={provider.id}
              onClick={() => toggleProvider(provider.id)}
              className={`
                px-3 py-1 rounded-full text-xs font-medium border transition-all duration-200
                ${
                  selectedProviders.includes(provider.id)
                    ? provider.color
                    : "bg-white/20 dark:bg-white/5 text-gray-600 dark:text-gray-400 border-gray-300/50 dark:border-gray-600/50 backdrop-blur-sm"
                }
                hover:scale-105 active:scale-95
              `}
            >
              {provider.label}
            </button>
          ))}
        </div>

        {/* Autocomplete Dropdown */}
        {showAutocomplete && autocompleteSuggestions.length > 0 && (
          <div className="absolute z-20 w-full mt-1 bg-white/90 dark:bg-gray-800/90 backdrop-blur-md border-2 border-gray-300/50 dark:border-gray-600/50 rounded-lg shadow-lg max-h-60 overflow-y-auto">
            {autocompleteSuggestions.map((cert) => (
              <button
                key={cert.id}
                onClick={() => handleAutocompleteSelect(cert)}
                className="w-full px-4 py-3 text-left hover:bg-white/50 dark:hover:bg-white/10
                         text-gray-900 dark:text-white transition-all duration-200"
              >
                <div className="font-medium">{cert.name}</div>
                <div className="text-xs text-gray-600 dark:text-gray-400">
                  {cert.provider.toUpperCase()}
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Results Count */}
      {searchQuery && (
        <div className="text-sm text-gray-600 dark:text-gray-400">
          Found {filteredCertifications.length} certification
          {filteredCertifications.length !== 1 ? "s" : ""}
        </div>
      )}

      {/* Certification Grid */}
      {displayedCertifications.length > 0 ? (
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-3 lg:gap-4">
          <AnimatePresence mode="popLayout">
            {displayedCertifications.map((cert, index) => (
              <motion.div
                key={cert.id}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{
                  duration: 0.3,
                  delay: index * 0.05,
                  ease: "easeOut",
                }}
                layout
              >
                <CertificationBadge
                  certification={cert}
                  isSelected={selectedCertifications.includes(cert.id)}
                  onSelect={handleSelect}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12 text-gray-500 dark:text-gray-400"
        >
          No certifications found matching &quot;{searchQuery}&quot;
        </motion.div>
      )}

      {/* Show More/Less Button */}
      {hasMore && !searchQuery && (
        <div className="flex justify-center pt-4">
          <button
            onClick={() => setShowAll(!showAll)}
            className="flex items-center gap-2 text-gray-900 dark:text-white hover:text-emerald-500 dark:hover:text-emerald-400 transition-colors duration-200 font-medium"
          >
            {showAll ? (
              <>
                Show Less
                <ChevronUp className="w-4 h-4" />
              </>
            ) : (
              <>
                Show All ({filteredCertifications.length - maxToShow} more)
                <ChevronDown className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
}
