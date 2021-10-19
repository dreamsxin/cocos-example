// <auto-generated>
//     Generated by the protocol buffer compiler.  DO NOT EDIT!
//     source: monopoly/announce_received_chance_spec.proto
// </auto-generated>
#pragma warning disable 1591, 0612, 3021
#region Designer generated code

using pb = global::Google.Protobuf;
using pbc = global::Google.Protobuf.Collections;
using pbr = global::Google.Protobuf.Reflection;
using scg = global::System.Collections.Generic;
namespace Monopoly.Protobuf {

  /// <summary>Holder for reflection information generated from monopoly/announce_received_chance_spec.proto</summary>
  public static partial class AnnounceReceivedChanceSpecReflection {

    #region Descriptor
    /// <summary>File descriptor for monopoly/announce_received_chance_spec.proto</summary>
    public static pbr::FileDescriptor Descriptor {
      get { return descriptor; }
    }
    private static pbr::FileDescriptor descriptor;

    static AnnounceReceivedChanceSpecReflection() {
      byte[] descriptorData = global::System.Convert.FromBase64String(
          string.Concat(
            "Cixtb25vcG9seS9hbm5vdW5jZV9yZWNlaXZlZF9jaGFuY2Vfc3BlYy5wcm90",
            "bxIIbW9ub3BvbHkaFW1vbm9wb2x5L2NoYW5jZS5wcm90byJRCh1Bbm5vdW5j",
            "ZVJlY2lldmVkQ2hhbmNlUGF5bG9hZBIOCgZwbGF5ZXIYASABKAkSIAoGY2hh",
            "bmNlGAIgASgLMhAubW9ub3BvbHkuQ2hhbmNlQhSqAhFNb25vcG9seS5Qcm90",
            "b2J1ZmIGcHJvdG8z"));
      descriptor = pbr::FileDescriptor.FromGeneratedCode(descriptorData,
          new pbr::FileDescriptor[] { global::Monopoly.Protobuf.ChanceReflection.Descriptor, },
          new pbr::GeneratedClrTypeInfo(null, null, new pbr::GeneratedClrTypeInfo[] {
            new pbr::GeneratedClrTypeInfo(typeof(global::Monopoly.Protobuf.AnnounceRecievedChancePayload), global::Monopoly.Protobuf.AnnounceRecievedChancePayload.Parser, new[]{ "Player", "Chance" }, null, null, null, null)
          }));
    }
    #endregion

  }
  #region Messages
  /// <summary>
  /// TODO: this seems useless. There is already animation for showing chance chest
  /// open/close.
  /// type : "announce_received_chance"
  /// packet_type : DEFAULT
  /// </summary>
  public sealed partial class AnnounceRecievedChancePayload : pb::IMessage<AnnounceRecievedChancePayload>
  #if !GOOGLE_PROTOBUF_REFSTRUCT_COMPATIBILITY_MODE
      , pb::IBufferMessage
  #endif
  {
    private static readonly pb::MessageParser<AnnounceRecievedChancePayload> _parser = new pb::MessageParser<AnnounceRecievedChancePayload>(() => new AnnounceRecievedChancePayload());
    private pb::UnknownFieldSet _unknownFields;
    [global::System.Diagnostics.DebuggerNonUserCodeAttribute]
    public static pb::MessageParser<AnnounceRecievedChancePayload> Parser { get { return _parser; } }

    [global::System.Diagnostics.DebuggerNonUserCodeAttribute]
    public static pbr::MessageDescriptor Descriptor {
      get { return global::Monopoly.Protobuf.AnnounceReceivedChanceSpecReflection.Descriptor.MessageTypes[0]; }
    }

    [global::System.Diagnostics.DebuggerNonUserCodeAttribute]
    pbr::MessageDescriptor pb::IMessage.Descriptor {
      get { return Descriptor; }
    }

    [global::System.Diagnostics.DebuggerNonUserCodeAttribute]
    public AnnounceRecievedChancePayload() {
      OnConstruction();
    }

    partial void OnConstruction();

    [global::System.Diagnostics.DebuggerNonUserCodeAttribute]
    public AnnounceRecievedChancePayload(AnnounceRecievedChancePayload other) : this() {
      player_ = other.player_;
      chance_ = other.chance_ != null ? other.chance_.Clone() : null;
      _unknownFields = pb::UnknownFieldSet.Clone(other._unknownFields);
    }

    [global::System.Diagnostics.DebuggerNonUserCodeAttribute]
    public AnnounceRecievedChancePayload Clone() {
      return new AnnounceRecievedChancePayload(this);
    }

    /// <summary>Field number for the "player" field.</summary>
    public const int PlayerFieldNumber = 1;
    private string player_ = "";
    [global::System.Diagnostics.DebuggerNonUserCodeAttribute]
    public string Player {
      get { return player_; }
      set {
        player_ = pb::ProtoPreconditions.CheckNotNull(value, "value");
      }
    }

    /// <summary>Field number for the "chance" field.</summary>
    public const int ChanceFieldNumber = 2;
    private global::Monopoly.Protobuf.Chance chance_;
    [global::System.Diagnostics.DebuggerNonUserCodeAttribute]
    public global::Monopoly.Protobuf.Chance Chance {
      get { return chance_; }
      set {
        chance_ = value;
      }
    }

    [global::System.Diagnostics.DebuggerNonUserCodeAttribute]
    public override bool Equals(object other) {
      return Equals(other as AnnounceRecievedChancePayload);
    }

    [global::System.Diagnostics.DebuggerNonUserCodeAttribute]
    public bool Equals(AnnounceRecievedChancePayload other) {
      if (ReferenceEquals(other, null)) {
        return false;
      }
      if (ReferenceEquals(other, this)) {
        return true;
      }
      if (Player != other.Player) return false;
      if (!object.Equals(Chance, other.Chance)) return false;
      return Equals(_unknownFields, other._unknownFields);
    }

    [global::System.Diagnostics.DebuggerNonUserCodeAttribute]
    public override int GetHashCode() {
      int hash = 1;
      if (Player.Length != 0) hash ^= Player.GetHashCode();
      if (chance_ != null) hash ^= Chance.GetHashCode();
      if (_unknownFields != null) {
        hash ^= _unknownFields.GetHashCode();
      }
      return hash;
    }

    [global::System.Diagnostics.DebuggerNonUserCodeAttribute]
    public override string ToString() {
      return pb::JsonFormatter.ToDiagnosticString(this);
    }

    [global::System.Diagnostics.DebuggerNonUserCodeAttribute]
    public void WriteTo(pb::CodedOutputStream output) {
    #if !GOOGLE_PROTOBUF_REFSTRUCT_COMPATIBILITY_MODE
      output.WriteRawMessage(this);
    #else
      if (Player.Length != 0) {
        output.WriteRawTag(10);
        output.WriteString(Player);
      }
      if (chance_ != null) {
        output.WriteRawTag(18);
        output.WriteMessage(Chance);
      }
      if (_unknownFields != null) {
        _unknownFields.WriteTo(output);
      }
    #endif
    }

    #if !GOOGLE_PROTOBUF_REFSTRUCT_COMPATIBILITY_MODE
    [global::System.Diagnostics.DebuggerNonUserCodeAttribute]
    void pb::IBufferMessage.InternalWriteTo(ref pb::WriteContext output) {
      if (Player.Length != 0) {
        output.WriteRawTag(10);
        output.WriteString(Player);
      }
      if (chance_ != null) {
        output.WriteRawTag(18);
        output.WriteMessage(Chance);
      }
      if (_unknownFields != null) {
        _unknownFields.WriteTo(ref output);
      }
    }
    #endif

    [global::System.Diagnostics.DebuggerNonUserCodeAttribute]
    public int CalculateSize() {
      int size = 0;
      if (Player.Length != 0) {
        size += 1 + pb::CodedOutputStream.ComputeStringSize(Player);
      }
      if (chance_ != null) {
        size += 1 + pb::CodedOutputStream.ComputeMessageSize(Chance);
      }
      if (_unknownFields != null) {
        size += _unknownFields.CalculateSize();
      }
      return size;
    }

    [global::System.Diagnostics.DebuggerNonUserCodeAttribute]
    public void MergeFrom(AnnounceRecievedChancePayload other) {
      if (other == null) {
        return;
      }
      if (other.Player.Length != 0) {
        Player = other.Player;
      }
      if (other.chance_ != null) {
        if (chance_ == null) {
          Chance = new global::Monopoly.Protobuf.Chance();
        }
        Chance.MergeFrom(other.Chance);
      }
      _unknownFields = pb::UnknownFieldSet.MergeFrom(_unknownFields, other._unknownFields);
    }

    [global::System.Diagnostics.DebuggerNonUserCodeAttribute]
    public void MergeFrom(pb::CodedInputStream input) {
    #if !GOOGLE_PROTOBUF_REFSTRUCT_COMPATIBILITY_MODE
      input.ReadRawMessage(this);
    #else
      uint tag;
      while ((tag = input.ReadTag()) != 0) {
        switch(tag) {
          default:
            _unknownFields = pb::UnknownFieldSet.MergeFieldFrom(_unknownFields, input);
            break;
          case 10: {
            Player = input.ReadString();
            break;
          }
          case 18: {
            if (chance_ == null) {
              Chance = new global::Monopoly.Protobuf.Chance();
            }
            input.ReadMessage(Chance);
            break;
          }
        }
      }
    #endif
    }

    #if !GOOGLE_PROTOBUF_REFSTRUCT_COMPATIBILITY_MODE
    [global::System.Diagnostics.DebuggerNonUserCodeAttribute]
    void pb::IBufferMessage.InternalMergeFrom(ref pb::ParseContext input) {
      uint tag;
      while ((tag = input.ReadTag()) != 0) {
        switch(tag) {
          default:
            _unknownFields = pb::UnknownFieldSet.MergeFieldFrom(_unknownFields, ref input);
            break;
          case 10: {
            Player = input.ReadString();
            break;
          }
          case 18: {
            if (chance_ == null) {
              Chance = new global::Monopoly.Protobuf.Chance();
            }
            input.ReadMessage(Chance);
            break;
          }
        }
      }
    }
    #endif

  }

  #endregion

}

#endregion Designer generated code
