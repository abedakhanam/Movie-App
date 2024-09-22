import { useState } from "react";

interface FilterOption {
  label: string;
  value: string;
}

interface DiscoveryHeaderProps {
  genre: FilterOption[];
  ratings: FilterOption[];
  type: FilterOption[];
  certificate: FilterOption[];
  onFilterChange: (filters: {
    genre?: string;
    rating?: string;
    type?: string;
    certificate?: string;
  }) => void;
}
const DiscoveryHeader: React.FC<DiscoveryHeaderProps> = ({
  genre,
  ratings,
  type,
  certificate,
  onFilterChange,
}) => {
  const [selectedGenre, setSelectedGenre] = useState<string>("");
  const [selectedRating, setSelectedRating] = useState<string>("");
  const [selectedType, setSelectedType] = useState<string>("");
  const [selectedCertificate, setSelectedCertificate] = useState<string>("");

  const handleGenreChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedGenre(e.target.value);
    onFilterChange({
      genre: e.target.value,
      rating: selectedRating,
      type: selectedType,
      certificate: selectedCertificate,
    });
  };

  const handleRatingChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedRating(e.target.value);
    onFilterChange({
      genre: selectedGenre,
      rating: e.target.value,
      type: selectedType,
      certificate: selectedCertificate,
    });
  };

  const handleTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedType(e.target.value);
    onFilterChange({
      genre: selectedGenre,
      rating: selectedRating,
      type: e.target.value,
      certificate: selectedCertificate,
    });
  };

  const handleCertificateChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedCertificate(e.target.value);
    onFilterChange({
      genre: selectedGenre,
      rating: selectedRating,
      type: selectedType,
      certificate: e.target.value,
    });
  };

  return (
    <div className="bg-gray- p-4 rounded-lg shadow-sm">
      <div className="flex flex-col md:flex-row items-center justify-between">
        {/* Genre Filter */}
        <select
          // className="border border-gray-300 rounded-md p-2 mb-4 md:mb-0 md:mr-4 w-full md:w-1/4"
          className={`w-full max-w-[250px] h-8 text-xs font-light tracking-wide text-center uppercase align-middle rounded-full px-3
            border cursor-pointer bg-red-50 border-red-500 hover:bg-red-100 text-red-800 overflow-auto custom-scrollbar`}
          value={selectedGenre}
          onChange={handleGenreChange}
        >
          <option value="">Select Genre</option>
          {genre.map((genre) => (
            <option key={genre.value} value={genre.value}>
              {genre.label}
            </option>
          ))}
        </select>

        {/* Rating Filter */}
        <select
          // className="border border-gray-300 rounded-md p-2 w-full md:w-1/4"
          className={`w-full max-w-[250px] h-8 text-xs font-light tracking-wide text-center uppercase align-middle rounded-full px-3
            border cursor-pointer bg-red-50 border-red-500 hover:bg-red-100 text-red-800 overflow-auto custom-scrollbar`}
          value={selectedRating}
          onChange={handleRatingChange}
        >
          <option value="">Select Rating</option>
          {ratings.map((rating) => (
            <option key={rating.value} value={rating.value}>
              {rating.label}
            </option>
          ))}
        </select>

        {/* Rating Filter */}
        <select
          // className="border border-gray-300 rounded-md p-2 w-full md:w-1/4"
          className={`w-full max-w-[250px] h-8 text-xs font-light tracking-wide text-center uppercase align-middle rounded-full px-3
            border cursor-pointer bg-red-50 border-red-500 hover:bg-red-100 text-red-800 overflow-auto custom-scrollbar`}
          value={selectedType}
          onChange={handleTypeChange}
        >
          <option value="">Select Type</option>
          {type.map((t) => (
            <option key={t.value} value={t.value}>
              {t.label}
            </option>
          ))}
        </select>

        {/* Certificate Filter */}
        <select
          // className="border border-gray-300 rounded-md p-2 w-full md:w-1/4"
          className={`w-full max-w-[250px] h-8 text-xs font-light tracking-wide text-center uppercase align-middle rounded-full px-3
            border cursor-pointer bg-red-50 border-red-500 hover:bg-red-100 text-red-800 overflow-auto custom-scrollbar`}
          value={selectedCertificate}
          onChange={handleCertificateChange}
        >
          <option value="">Select Certificate</option>
          {certificate.map((c) => (
            <option key={c.value} value={c.value}>
              {c.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default DiscoveryHeader;
