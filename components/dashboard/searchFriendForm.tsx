import { searchFriend } from "@/actions/search-friend/searchFriend";

// 
export default function SearchFriendForm() {
  return (
    <form action={searchFriend} className="space-y-4 lg:w-3/5">
      <input
        //type="number"
        name="phoneSearched"
        required
        placeholder="son numéro de portable"
        className="p-2 rounded w-full text-center border-2 border-indigo-600"
      />
      <button
        type="submit"
        className="bg-indigo-600 w-full text-white px-4 py-2 rounded"
      >
        Rechercher
      </button>
    </form>
  );
}

/*
*/