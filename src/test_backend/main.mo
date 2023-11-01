import HashMap "mo:base/HashMap";
import Text "mo:base/Text";
import Nat "mo:base/Nat";
import Iter "mo:base/Iter";

actor {

  let map = HashMap.HashMap<Text, Text>(5, Text.equal, Text.hash);

  public func setData(creator : Text, imagB64 : Text) : async () {
    map.put(creator, imagB64);
  };

  public func getArt(creator : Text) : async ?Text {
    return (map.get(creator));
  };

  public func getSize() : async Nat {
    return (map.size());
  };

  //   public func replaceArt(creator:Text, imagB64:Text) : async () {
  //       ignore map.replace(creator, imagB64);
  //   };

  //   public func deleteArt(creator:Text) : async () {
  //       map.delete(creator);
  //   };

  public func getKey() : async Text {
    var keys = "";
    for (key in map.keys()) {
      keys := key # " " # keys;
    };
    return keys;
  };

  public func getValue() : async Text {
    var values = "";
    for (value in map.keys()) {
      values := value # " " # values;
    };
    return values;
  };

};
