// <auto-generated>
//     Generated by the protocol buffer compiler.  DO NOT EDIT!
//     source: monopoly/chance.proto
// </auto-generated>
#pragma warning disable 1591, 0612, 3021
#region Designer generated code

using pb = global::Google.Protobuf;
using pbc = global::Google.Protobuf.Collections;
using pbr = global::Google.Protobuf.Reflection;
using scg = global::System.Collections.Generic;
namespace Monopoly.Protobuf {

  /// <summary>Holder for reflection information generated from monopoly/chance.proto</summary>
  public static partial class ChanceReflection {

    #region Descriptor
    /// <summary>File descriptor for monopoly/chance.proto</summary>
    public static pbr::FileDescriptor Descriptor {
      get { return descriptor; }
    }
    private static pbr::FileDescriptor descriptor;

    static ChanceReflection() {
      byte[] descriptorData = global::System.Convert.FromBase64String(
          string.Concat(
            "ChVtb25vcG9seS9jaGFuY2UucHJvdG8SCG1vbm9wb2x5GiFtb25vcG9seS9t",
            "b3ZlX3RvX3RpbGVfZXh0cmEucHJvdG8aI21vbm9wb2x5L21vbmV5X2V4Y2hh",
            "bmdlX2V4dHJhLnByb3RvGh9tb25vcG9seS9tb3ZlX3N0ZXBzX2V4dHJhLnBy",
            "b3RvGiBtb25vcG9seS9jb2xsZWN0aWJsZV9leHRyYS5wcm90byJRCg1DaGFu",
            "Y2VEaXNwbGF5Eg0KBXRpdGxlGAEgASgJEhMKC2Rlc2NyaXB0aW9uGAIgASgJ",
            "EhIKBWltYWdlGAMgASgJSACIAQFCCAoGX2ltYWdlIqACCgZDaGFuY2USKAoH",
            "ZGlzcGxheRgBIAEoCzIXLm1vbm9wb2x5LkNoYW5jZURpc3BsYXkSFQoLdW5z",
            "cGVjaWZpZWQYAiABKAhIABIxCgxtb3ZlX3RvX3RpbGUYAyABKAsyGS5tb25v",
            "cG9seS5Nb3ZlVG9UaWxlRXh0cmFIABI2Cg5tb25leV9leGNoYW5nZRgEIAEo",
            "CzIcLm1vbm9wb2x5Lk1vbmV5RXhjaGFuZ2VFeHRyYUgAEi4KCm1vdmVfc3Rl",
            "cHMYBSABKAsyGC5tb25vcG9seS5Nb3ZlU3RlcHNFeHRyYUgAEjEKC2NvbGxl",
            "Y3RpYmxlGAYgASgLMhoubW9ub3BvbHkuQ29sbGVjdGlibGVFeHRyYUgAQgcK",
            "BWV4dHJhQhSqAhFNb25vcG9seS5Qcm90b2J1ZmIGcHJvdG8z"));
      descriptor = pbr::FileDescriptor.FromGeneratedCode(descriptorData,
          new pbr::FileDescriptor[] { global::Monopoly.Protobuf.MoveToTileExtraReflection.Descriptor, global::Monopoly.Protobuf.MoneyExchangeExtraReflection.Descriptor, global::Monopoly.Protobuf.MoveStepsExtraReflection.Descriptor, global::Monopoly.Protobuf.CollectibleExtraReflection.Descriptor, },
          new pbr::GeneratedClrTypeInfo(null, null, new pbr::GeneratedClrTypeInfo[] {
            new pbr::GeneratedClrTypeInfo(typeof(global::Monopoly.Protobuf.ChanceDisplay), global::Monopoly.Protobuf.ChanceDisplay.Parser, new[]{ "Title", "Description", "Image" }, new[]{ "Image" }, null, null, null),
            new pbr::GeneratedClrTypeInfo(typeof(global::Monopoly.Protobuf.Chance), global::Monopoly.Protobuf.Chance.Parser, new[]{ "Display", "Unspecified", "MoveToTile", "MoneyExchange", "MoveSteps", "Collectible" }, new[]{ "Extra" }, null, null, null)
          }));
    }
    #endregion

  }
  #region Messages
  public sealed partial class ChanceDisplay : pb::IMessage<ChanceDisplay>
  #if !GOOGLE_PROTOBUF_REFSTRUCT_COMPATIBILITY_MODE
      , pb::IBufferMessage
  #endif
  {
    private static readonly pb::MessageParser<ChanceDisplay> _parser = new pb::MessageParser<ChanceDisplay>(() => new ChanceDisplay());
    private pb::UnknownFieldSet _unknownFields;
    [global::System.Diagnostics.DebuggerNonUserCodeAttribute]
    public static pb::MessageParser<ChanceDisplay> Parser { get { return _parser; } }

    [global::System.Diagnostics.DebuggerNonUserCodeAttribute]
    public static pbr::MessageDescriptor Descriptor {
      get { return global::Monopoly.Protobuf.ChanceReflection.Descriptor.MessageTypes[0]; }
    }

    [global::System.Diagnostics.DebuggerNonUserCodeAttribute]
    pbr::MessageDescriptor pb::IMessage.Descriptor {
      get { return Descriptor; }
    }

    [global::System.Diagnostics.DebuggerNonUserCodeAttribute]
    public ChanceDisplay() {
      OnConstruction();
    }

    partial void OnConstruction();

    [global::System.Diagnostics.DebuggerNonUserCodeAttribute]
    public ChanceDisplay(ChanceDisplay other) : this() {
      title_ = other.title_;
      description_ = other.description_;
      image_ = other.image_;
      _unknownFields = pb::UnknownFieldSet.Clone(other._unknownFields);
    }

    [global::System.Diagnostics.DebuggerNonUserCodeAttribute]
    public ChanceDisplay Clone() {
      return new ChanceDisplay(this);
    }

    /// <summary>Field number for the "title" field.</summary>
    public const int TitleFieldNumber = 1;
    private string title_ = "";
    [global::System.Diagnostics.DebuggerNonUserCodeAttribute]
    public string Title {
      get { return title_; }
      set {
        title_ = pb::ProtoPreconditions.CheckNotNull(value, "value");
      }
    }

    /// <summary>Field number for the "description" field.</summary>
    public const int DescriptionFieldNumber = 2;
    private string description_ = "";
    [global::System.Diagnostics.DebuggerNonUserCodeAttribute]
    public string Description {
      get { return description_; }
      set {
        description_ = pb::ProtoPreconditions.CheckNotNull(value, "value");
      }
    }

    /// <summary>Field number for the "image" field.</summary>
    public const int ImageFieldNumber = 3;
    private string image_;
    [global::System.Diagnostics.DebuggerNonUserCodeAttribute]
    public string Image {
      get { return image_ ?? ""; }
      set {
        image_ = pb::ProtoPreconditions.CheckNotNull(value, "value");
      }
    }
    /// <summary>Gets whether the "image" field is set</summary>
    [global::System.Diagnostics.DebuggerNonUserCodeAttribute]
    public bool HasImage {
      get { return image_ != null; }
    }
    /// <summary>Clears the value of the "image" field</summary>
    [global::System.Diagnostics.DebuggerNonUserCodeAttribute]
    public void ClearImage() {
      image_ = null;
    }

    [global::System.Diagnostics.DebuggerNonUserCodeAttribute]
    public override bool Equals(object other) {
      return Equals(other as ChanceDisplay);
    }

    [global::System.Diagnostics.DebuggerNonUserCodeAttribute]
    public bool Equals(ChanceDisplay other) {
      if (ReferenceEquals(other, null)) {
        return false;
      }
      if (ReferenceEquals(other, this)) {
        return true;
      }
      if (Title != other.Title) return false;
      if (Description != other.Description) return false;
      if (Image != other.Image) return false;
      return Equals(_unknownFields, other._unknownFields);
    }

    [global::System.Diagnostics.DebuggerNonUserCodeAttribute]
    public override int GetHashCode() {
      int hash = 1;
      if (Title.Length != 0) hash ^= Title.GetHashCode();
      if (Description.Length != 0) hash ^= Description.GetHashCode();
      if (HasImage) hash ^= Image.GetHashCode();
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
      if (Title.Length != 0) {
        output.WriteRawTag(10);
        output.WriteString(Title);
      }
      if (Description.Length != 0) {
        output.WriteRawTag(18);
        output.WriteString(Description);
      }
      if (HasImage) {
        output.WriteRawTag(26);
        output.WriteString(Image);
      }
      if (_unknownFields != null) {
        _unknownFields.WriteTo(output);
      }
    #endif
    }

    #if !GOOGLE_PROTOBUF_REFSTRUCT_COMPATIBILITY_MODE
    [global::System.Diagnostics.DebuggerNonUserCodeAttribute]
    void pb::IBufferMessage.InternalWriteTo(ref pb::WriteContext output) {
      if (Title.Length != 0) {
        output.WriteRawTag(10);
        output.WriteString(Title);
      }
      if (Description.Length != 0) {
        output.WriteRawTag(18);
        output.WriteString(Description);
      }
      if (HasImage) {
        output.WriteRawTag(26);
        output.WriteString(Image);
      }
      if (_unknownFields != null) {
        _unknownFields.WriteTo(ref output);
      }
    }
    #endif

    [global::System.Diagnostics.DebuggerNonUserCodeAttribute]
    public int CalculateSize() {
      int size = 0;
      if (Title.Length != 0) {
        size += 1 + pb::CodedOutputStream.ComputeStringSize(Title);
      }
      if (Description.Length != 0) {
        size += 1 + pb::CodedOutputStream.ComputeStringSize(Description);
      }
      if (HasImage) {
        size += 1 + pb::CodedOutputStream.ComputeStringSize(Image);
      }
      if (_unknownFields != null) {
        size += _unknownFields.CalculateSize();
      }
      return size;
    }

    [global::System.Diagnostics.DebuggerNonUserCodeAttribute]
    public void MergeFrom(ChanceDisplay other) {
      if (other == null) {
        return;
      }
      if (other.Title.Length != 0) {
        Title = other.Title;
      }
      if (other.Description.Length != 0) {
        Description = other.Description;
      }
      if (other.HasImage) {
        Image = other.Image;
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
            Title = input.ReadString();
            break;
          }
          case 18: {
            Description = input.ReadString();
            break;
          }
          case 26: {
            Image = input.ReadString();
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
            Title = input.ReadString();
            break;
          }
          case 18: {
            Description = input.ReadString();
            break;
          }
          case 26: {
            Image = input.ReadString();
            break;
          }
        }
      }
    }
    #endif

  }

  public sealed partial class Chance : pb::IMessage<Chance>
  #if !GOOGLE_PROTOBUF_REFSTRUCT_COMPATIBILITY_MODE
      , pb::IBufferMessage
  #endif
  {
    private static readonly pb::MessageParser<Chance> _parser = new pb::MessageParser<Chance>(() => new Chance());
    private pb::UnknownFieldSet _unknownFields;
    [global::System.Diagnostics.DebuggerNonUserCodeAttribute]
    public static pb::MessageParser<Chance> Parser { get { return _parser; } }

    [global::System.Diagnostics.DebuggerNonUserCodeAttribute]
    public static pbr::MessageDescriptor Descriptor {
      get { return global::Monopoly.Protobuf.ChanceReflection.Descriptor.MessageTypes[1]; }
    }

    [global::System.Diagnostics.DebuggerNonUserCodeAttribute]
    pbr::MessageDescriptor pb::IMessage.Descriptor {
      get { return Descriptor; }
    }

    [global::System.Diagnostics.DebuggerNonUserCodeAttribute]
    public Chance() {
      OnConstruction();
    }

    partial void OnConstruction();

    [global::System.Diagnostics.DebuggerNonUserCodeAttribute]
    public Chance(Chance other) : this() {
      display_ = other.display_ != null ? other.display_.Clone() : null;
      switch (other.ExtraCase) {
        case ExtraOneofCase.Unspecified:
          Unspecified = other.Unspecified;
          break;
        case ExtraOneofCase.MoveToTile:
          MoveToTile = other.MoveToTile.Clone();
          break;
        case ExtraOneofCase.MoneyExchange:
          MoneyExchange = other.MoneyExchange.Clone();
          break;
        case ExtraOneofCase.MoveSteps:
          MoveSteps = other.MoveSteps.Clone();
          break;
        case ExtraOneofCase.Collectible:
          Collectible = other.Collectible.Clone();
          break;
      }

      _unknownFields = pb::UnknownFieldSet.Clone(other._unknownFields);
    }

    [global::System.Diagnostics.DebuggerNonUserCodeAttribute]
    public Chance Clone() {
      return new Chance(this);
    }

    /// <summary>Field number for the "display" field.</summary>
    public const int DisplayFieldNumber = 1;
    private global::Monopoly.Protobuf.ChanceDisplay display_;
    [global::System.Diagnostics.DebuggerNonUserCodeAttribute]
    public global::Monopoly.Protobuf.ChanceDisplay Display {
      get { return display_; }
      set {
        display_ = value;
      }
    }

    /// <summary>Field number for the "unspecified" field.</summary>
    public const int UnspecifiedFieldNumber = 2;
    [global::System.Diagnostics.DebuggerNonUserCodeAttribute]
    public bool Unspecified {
      get { return extraCase_ == ExtraOneofCase.Unspecified ? (bool) extra_ : false; }
      set {
        extra_ = value;
        extraCase_ = ExtraOneofCase.Unspecified;
      }
    }

    /// <summary>Field number for the "move_to_tile" field.</summary>
    public const int MoveToTileFieldNumber = 3;
    [global::System.Diagnostics.DebuggerNonUserCodeAttribute]
    public global::Monopoly.Protobuf.MoveToTileExtra MoveToTile {
      get { return extraCase_ == ExtraOneofCase.MoveToTile ? (global::Monopoly.Protobuf.MoveToTileExtra) extra_ : null; }
      set {
        extra_ = value;
        extraCase_ = value == null ? ExtraOneofCase.None : ExtraOneofCase.MoveToTile;
      }
    }

    /// <summary>Field number for the "money_exchange" field.</summary>
    public const int MoneyExchangeFieldNumber = 4;
    [global::System.Diagnostics.DebuggerNonUserCodeAttribute]
    public global::Monopoly.Protobuf.MoneyExchangeExtra MoneyExchange {
      get { return extraCase_ == ExtraOneofCase.MoneyExchange ? (global::Monopoly.Protobuf.MoneyExchangeExtra) extra_ : null; }
      set {
        extra_ = value;
        extraCase_ = value == null ? ExtraOneofCase.None : ExtraOneofCase.MoneyExchange;
      }
    }

    /// <summary>Field number for the "move_steps" field.</summary>
    public const int MoveStepsFieldNumber = 5;
    [global::System.Diagnostics.DebuggerNonUserCodeAttribute]
    public global::Monopoly.Protobuf.MoveStepsExtra MoveSteps {
      get { return extraCase_ == ExtraOneofCase.MoveSteps ? (global::Monopoly.Protobuf.MoveStepsExtra) extra_ : null; }
      set {
        extra_ = value;
        extraCase_ = value == null ? ExtraOneofCase.None : ExtraOneofCase.MoveSteps;
      }
    }

    /// <summary>Field number for the "collectible" field.</summary>
    public const int CollectibleFieldNumber = 6;
    [global::System.Diagnostics.DebuggerNonUserCodeAttribute]
    public global::Monopoly.Protobuf.CollectibleExtra Collectible {
      get { return extraCase_ == ExtraOneofCase.Collectible ? (global::Monopoly.Protobuf.CollectibleExtra) extra_ : null; }
      set {
        extra_ = value;
        extraCase_ = value == null ? ExtraOneofCase.None : ExtraOneofCase.Collectible;
      }
    }

    private object extra_;
    /// <summary>Enum of possible cases for the "extra" oneof.</summary>
    public enum ExtraOneofCase {
      None = 0,
      Unspecified = 2,
      MoveToTile = 3,
      MoneyExchange = 4,
      MoveSteps = 5,
      Collectible = 6,
    }
    private ExtraOneofCase extraCase_ = ExtraOneofCase.None;
    [global::System.Diagnostics.DebuggerNonUserCodeAttribute]
    public ExtraOneofCase ExtraCase {
      get { return extraCase_; }
    }

    [global::System.Diagnostics.DebuggerNonUserCodeAttribute]
    public void ClearExtra() {
      extraCase_ = ExtraOneofCase.None;
      extra_ = null;
    }

    [global::System.Diagnostics.DebuggerNonUserCodeAttribute]
    public override bool Equals(object other) {
      return Equals(other as Chance);
    }

    [global::System.Diagnostics.DebuggerNonUserCodeAttribute]
    public bool Equals(Chance other) {
      if (ReferenceEquals(other, null)) {
        return false;
      }
      if (ReferenceEquals(other, this)) {
        return true;
      }
      if (!object.Equals(Display, other.Display)) return false;
      if (Unspecified != other.Unspecified) return false;
      if (!object.Equals(MoveToTile, other.MoveToTile)) return false;
      if (!object.Equals(MoneyExchange, other.MoneyExchange)) return false;
      if (!object.Equals(MoveSteps, other.MoveSteps)) return false;
      if (!object.Equals(Collectible, other.Collectible)) return false;
      if (ExtraCase != other.ExtraCase) return false;
      return Equals(_unknownFields, other._unknownFields);
    }

    [global::System.Diagnostics.DebuggerNonUserCodeAttribute]
    public override int GetHashCode() {
      int hash = 1;
      if (display_ != null) hash ^= Display.GetHashCode();
      if (extraCase_ == ExtraOneofCase.Unspecified) hash ^= Unspecified.GetHashCode();
      if (extraCase_ == ExtraOneofCase.MoveToTile) hash ^= MoveToTile.GetHashCode();
      if (extraCase_ == ExtraOneofCase.MoneyExchange) hash ^= MoneyExchange.GetHashCode();
      if (extraCase_ == ExtraOneofCase.MoveSteps) hash ^= MoveSteps.GetHashCode();
      if (extraCase_ == ExtraOneofCase.Collectible) hash ^= Collectible.GetHashCode();
      hash ^= (int) extraCase_;
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
      if (display_ != null) {
        output.WriteRawTag(10);
        output.WriteMessage(Display);
      }
      if (extraCase_ == ExtraOneofCase.Unspecified) {
        output.WriteRawTag(16);
        output.WriteBool(Unspecified);
      }
      if (extraCase_ == ExtraOneofCase.MoveToTile) {
        output.WriteRawTag(26);
        output.WriteMessage(MoveToTile);
      }
      if (extraCase_ == ExtraOneofCase.MoneyExchange) {
        output.WriteRawTag(34);
        output.WriteMessage(MoneyExchange);
      }
      if (extraCase_ == ExtraOneofCase.MoveSteps) {
        output.WriteRawTag(42);
        output.WriteMessage(MoveSteps);
      }
      if (extraCase_ == ExtraOneofCase.Collectible) {
        output.WriteRawTag(50);
        output.WriteMessage(Collectible);
      }
      if (_unknownFields != null) {
        _unknownFields.WriteTo(output);
      }
    #endif
    }

    #if !GOOGLE_PROTOBUF_REFSTRUCT_COMPATIBILITY_MODE
    [global::System.Diagnostics.DebuggerNonUserCodeAttribute]
    void pb::IBufferMessage.InternalWriteTo(ref pb::WriteContext output) {
      if (display_ != null) {
        output.WriteRawTag(10);
        output.WriteMessage(Display);
      }
      if (extraCase_ == ExtraOneofCase.Unspecified) {
        output.WriteRawTag(16);
        output.WriteBool(Unspecified);
      }
      if (extraCase_ == ExtraOneofCase.MoveToTile) {
        output.WriteRawTag(26);
        output.WriteMessage(MoveToTile);
      }
      if (extraCase_ == ExtraOneofCase.MoneyExchange) {
        output.WriteRawTag(34);
        output.WriteMessage(MoneyExchange);
      }
      if (extraCase_ == ExtraOneofCase.MoveSteps) {
        output.WriteRawTag(42);
        output.WriteMessage(MoveSteps);
      }
      if (extraCase_ == ExtraOneofCase.Collectible) {
        output.WriteRawTag(50);
        output.WriteMessage(Collectible);
      }
      if (_unknownFields != null) {
        _unknownFields.WriteTo(ref output);
      }
    }
    #endif

    [global::System.Diagnostics.DebuggerNonUserCodeAttribute]
    public int CalculateSize() {
      int size = 0;
      if (display_ != null) {
        size += 1 + pb::CodedOutputStream.ComputeMessageSize(Display);
      }
      if (extraCase_ == ExtraOneofCase.Unspecified) {
        size += 1 + 1;
      }
      if (extraCase_ == ExtraOneofCase.MoveToTile) {
        size += 1 + pb::CodedOutputStream.ComputeMessageSize(MoveToTile);
      }
      if (extraCase_ == ExtraOneofCase.MoneyExchange) {
        size += 1 + pb::CodedOutputStream.ComputeMessageSize(MoneyExchange);
      }
      if (extraCase_ == ExtraOneofCase.MoveSteps) {
        size += 1 + pb::CodedOutputStream.ComputeMessageSize(MoveSteps);
      }
      if (extraCase_ == ExtraOneofCase.Collectible) {
        size += 1 + pb::CodedOutputStream.ComputeMessageSize(Collectible);
      }
      if (_unknownFields != null) {
        size += _unknownFields.CalculateSize();
      }
      return size;
    }

    [global::System.Diagnostics.DebuggerNonUserCodeAttribute]
    public void MergeFrom(Chance other) {
      if (other == null) {
        return;
      }
      if (other.display_ != null) {
        if (display_ == null) {
          Display = new global::Monopoly.Protobuf.ChanceDisplay();
        }
        Display.MergeFrom(other.Display);
      }
      switch (other.ExtraCase) {
        case ExtraOneofCase.Unspecified:
          Unspecified = other.Unspecified;
          break;
        case ExtraOneofCase.MoveToTile:
          if (MoveToTile == null) {
            MoveToTile = new global::Monopoly.Protobuf.MoveToTileExtra();
          }
          MoveToTile.MergeFrom(other.MoveToTile);
          break;
        case ExtraOneofCase.MoneyExchange:
          if (MoneyExchange == null) {
            MoneyExchange = new global::Monopoly.Protobuf.MoneyExchangeExtra();
          }
          MoneyExchange.MergeFrom(other.MoneyExchange);
          break;
        case ExtraOneofCase.MoveSteps:
          if (MoveSteps == null) {
            MoveSteps = new global::Monopoly.Protobuf.MoveStepsExtra();
          }
          MoveSteps.MergeFrom(other.MoveSteps);
          break;
        case ExtraOneofCase.Collectible:
          if (Collectible == null) {
            Collectible = new global::Monopoly.Protobuf.CollectibleExtra();
          }
          Collectible.MergeFrom(other.Collectible);
          break;
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
            if (display_ == null) {
              Display = new global::Monopoly.Protobuf.ChanceDisplay();
            }
            input.ReadMessage(Display);
            break;
          }
          case 16: {
            Unspecified = input.ReadBool();
            break;
          }
          case 26: {
            global::Monopoly.Protobuf.MoveToTileExtra subBuilder = new global::Monopoly.Protobuf.MoveToTileExtra();
            if (extraCase_ == ExtraOneofCase.MoveToTile) {
              subBuilder.MergeFrom(MoveToTile);
            }
            input.ReadMessage(subBuilder);
            MoveToTile = subBuilder;
            break;
          }
          case 34: {
            global::Monopoly.Protobuf.MoneyExchangeExtra subBuilder = new global::Monopoly.Protobuf.MoneyExchangeExtra();
            if (extraCase_ == ExtraOneofCase.MoneyExchange) {
              subBuilder.MergeFrom(MoneyExchange);
            }
            input.ReadMessage(subBuilder);
            MoneyExchange = subBuilder;
            break;
          }
          case 42: {
            global::Monopoly.Protobuf.MoveStepsExtra subBuilder = new global::Monopoly.Protobuf.MoveStepsExtra();
            if (extraCase_ == ExtraOneofCase.MoveSteps) {
              subBuilder.MergeFrom(MoveSteps);
            }
            input.ReadMessage(subBuilder);
            MoveSteps = subBuilder;
            break;
          }
          case 50: {
            global::Monopoly.Protobuf.CollectibleExtra subBuilder = new global::Monopoly.Protobuf.CollectibleExtra();
            if (extraCase_ == ExtraOneofCase.Collectible) {
              subBuilder.MergeFrom(Collectible);
            }
            input.ReadMessage(subBuilder);
            Collectible = subBuilder;
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
            if (display_ == null) {
              Display = new global::Monopoly.Protobuf.ChanceDisplay();
            }
            input.ReadMessage(Display);
            break;
          }
          case 16: {
            Unspecified = input.ReadBool();
            break;
          }
          case 26: {
            global::Monopoly.Protobuf.MoveToTileExtra subBuilder = new global::Monopoly.Protobuf.MoveToTileExtra();
            if (extraCase_ == ExtraOneofCase.MoveToTile) {
              subBuilder.MergeFrom(MoveToTile);
            }
            input.ReadMessage(subBuilder);
            MoveToTile = subBuilder;
            break;
          }
          case 34: {
            global::Monopoly.Protobuf.MoneyExchangeExtra subBuilder = new global::Monopoly.Protobuf.MoneyExchangeExtra();
            if (extraCase_ == ExtraOneofCase.MoneyExchange) {
              subBuilder.MergeFrom(MoneyExchange);
            }
            input.ReadMessage(subBuilder);
            MoneyExchange = subBuilder;
            break;
          }
          case 42: {
            global::Monopoly.Protobuf.MoveStepsExtra subBuilder = new global::Monopoly.Protobuf.MoveStepsExtra();
            if (extraCase_ == ExtraOneofCase.MoveSteps) {
              subBuilder.MergeFrom(MoveSteps);
            }
            input.ReadMessage(subBuilder);
            MoveSteps = subBuilder;
            break;
          }
          case 50: {
            global::Monopoly.Protobuf.CollectibleExtra subBuilder = new global::Monopoly.Protobuf.CollectibleExtra();
            if (extraCase_ == ExtraOneofCase.Collectible) {
              subBuilder.MergeFrom(Collectible);
            }
            input.ReadMessage(subBuilder);
            Collectible = subBuilder;
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
