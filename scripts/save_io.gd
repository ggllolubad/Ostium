class_name SaveIO
extends RefCounted
## Crash-safe save files. A write goes to <path>.tmp first and is checked; the old file is kept as <path>.bak until
## the new one is in place, so a crash or a full disk mid-write never leaves a half-written save. Reads fall back to
## the .bak (or a finished .tmp) when the main file is missing or will not parse.

## Every save path is relative to this folder. Tests point it somewhere else so they never touch a player's saves.
static var dir := "user://"

static func path(file: String) -> String:
	return dir.path_join(file)

## Writes text atomically. Returns false (and logs why) if any step fails; the previous file is then left intact.
static func write_text(p: String, text: String) -> bool:
	var base := p.get_base_dir()
	if base != "" and not DirAccess.dir_exists_absolute(base):
		DirAccess.make_dir_recursive_absolute(base)
	var tmp := p + ".tmp"
	var f := FileAccess.open(tmp, FileAccess.WRITE)
	if f == null:
		push_error("SaveIO: cannot open %s for writing (%s)" % [tmp, error_string(FileAccess.get_open_error())])
		return false
	f.store_string(text)
	f.flush()
	var werr := f.get_error()
	f.close()
	if werr != OK:
		push_error("SaveIO: writing %s failed (%s)" % [tmp, error_string(werr)])
		DirAccess.remove_absolute(_abs(tmp))
		return false
	# the write must read back whole before it replaces anything
	if FileAccess.get_file_as_string(tmp) != text:
		push_error("SaveIO: %s did not read back intact" % tmp)
		DirAccess.remove_absolute(_abs(tmp))
		return false
	var bak := p + ".bak"
	if FileAccess.file_exists(p):
		if FileAccess.file_exists(bak):
			DirAccess.remove_absolute(_abs(bak))
		if DirAccess.rename_absolute(_abs(p), _abs(bak)) != OK:
			push_error("SaveIO: cannot set aside %s" % p)
			DirAccess.remove_absolute(_abs(tmp))
			return false
	if DirAccess.rename_absolute(_abs(tmp), _abs(p)) != OK:
		push_error("SaveIO: cannot move %s into place" % tmp)
		if FileAccess.file_exists(bak) and not FileAccess.file_exists(p):
			DirAccess.rename_absolute(_abs(bak), _abs(p))
		return false
	if FileAccess.file_exists(bak):
		DirAccess.remove_absolute(_abs(bak))
	return true

static func write_json(p: String, v: Variant) -> bool:
	return write_text(p, JSON.stringify(v))

## Reads a JSON dictionary, trying the file, then its .bak, then a finished .tmp. Returns {} if none parse.
static func read_json(p: String) -> Dictionary:
	for cand in [p, p + ".bak", p + ".tmp"]:
		if not FileAccess.file_exists(cand):
			continue
		var v = JSON.parse_string(FileAccess.get_file_as_string(cand))
		if typeof(v) == TYPE_DICTIONARY:
			if cand != p:
				push_warning("SaveIO: %s was unreadable; recovered from %s" % [p, cand])
			return v
	return {}

static func exists(p: String) -> bool:
	return FileAccess.file_exists(p) or FileAccess.file_exists(p + ".bak") or FileAccess.file_exists(p + ".tmp")

## Deletes a save and any leftovers beside it.
static func remove(p: String) -> void:
	for cand in [p, p + ".bak", p + ".tmp"]:
		if FileAccess.file_exists(cand):
			DirAccess.remove_absolute(_abs(cand))

## Packs any Variant (int keys, typed numbers and all) into a string that survives a JSON save exactly.
## Objects are never encoded or decoded.
static func pack(v: Variant) -> String:
	return Marshalls.raw_to_base64(var_to_bytes(v))

static func unpack(s: String) -> Variant:
	if s == "":
		return null
	var raw := Marshalls.base64_to_raw(s)
	if raw.is_empty():
		return null
	return bytes_to_var(raw)

static func _abs(p: String) -> String:
	return ProjectSettings.globalize_path(p)

