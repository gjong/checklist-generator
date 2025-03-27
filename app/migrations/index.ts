import type {Checklist, ChecklistEntry, ChecklistSection} from "~/checklist.type";

type PatchRoutine = (checklist: Checklist) => boolean;
class VersionPatch {
    constructor(private semver: string, private routine: PatchRoutine) {}

    apply(checklist: Checklist): boolean {
        if (this.isLowerSemver(checklist.version || '0.0.0')) {
            return false;
        }

        return this.routine(checklist);
    }

    private isLowerSemver(other: string): boolean {
        // extract the major, minor and patch to check if the version is lower
        const [major, minor, patch] = this.semver.split('.').map(Number);
        const [otherMajor, otherMinor, otherPatch] = other.split('.').map(Number);
        return major < otherMajor || minor < otherMinor || patch < otherPatch;
    }

    get version(): string {
        return this.semver;
    }
}

// patch for v1.0.0 to v1.1.0: add order to all entries to allow for re-ordering in the list
const v1_1_0_patchCorrectOrder = (checklistEntries: ChecklistEntry[]): boolean => {
    let changed = false;
    for (let i = 0; i < checklistEntries.length; i++) {
        if (checklistEntries[i].order === undefined || checklistEntries[i].order < 0 ) {
            checklistEntries[i].order = i;
            changed = true;
        }

        if ('items' in checklistEntries[i]) {
            changed ||= v1_1_0_patchCorrectOrder((checklistEntries[i] as ChecklistSection).items)
        }
    }

    return changed;
}

const patches: VersionPatch[] = [
    new VersionPatch('1.0.0', checklist => v1_1_0_patchCorrectOrder(checklist.items))
]

export function patchAnyStructureChanges(checklist: Checklist): boolean {
    let patched = false;
    for (const patch of patches) {
        patched ||= patch.apply(checklist);
    }

    if (patched) {
        checklist.version = patches[patches.length - 1].version;
    }

    return patched;
}
