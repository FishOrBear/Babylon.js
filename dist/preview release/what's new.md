# 4.1.0

## Major updates
- WIP: Node Material (NEED DOC OR SAMPLES) ([Deltakosh](https://github.com/deltakosh/))
- WIP: Node material editor (NEED OR AND VIDEOS) ([Deltakosh](https://github.com/deltakosh/) / [TrevorDev](https://github.com/TrevorDev))
- WIP: WebGPU support (NEED DOC OR SAMPLES) ([Sebavan](https://github.com/sebavan/))
- .basis texture file format support [Doc](https://doc.babylonjs.com/resources/multi-platform_compressed_textures#basis-file-format) ([TrevorDev](https://github.com/TrevorDev))
- WIP: Recast navigation mesh and crowd of moving agents [Demo](https://www.babylonjs-playground.com/#AJTRIL) ([CedricGuillemet](https://github.com/CedricGuillemet))
- Classes decoupling ending up with smaller bundle sizes [Blog](https://medium.com/@babylonjs/size-matters-e0e94dad01a7) ([Deltakosh](https://github.com/deltakosh/))
- Babylon.js controls [Doc](https://doc.babylonjs.com/features/controls) ([Sebavan](https://github.com/sebavan/) / [Deltakosh](https://github.com/deltakosh/))
- WebXR updates:
  - WebXR updated to spec as of July 10th ([TrevorDev](https://github.com/TrevorDev))
  - WebXR webVR parity helpers (Vive, WMR, Oculus Rift) ([TrevorDev](https://github.com/TrevorDev))

## Updates

### General
- Added support for dual shock gamepads ([Deltakosh](https://github.com/deltakosh/))
- Support Vive Focus 3Dof controller ([TrevorDev](https://github.com/TrevorDev))
- Planar positioning support for GizmoManager ([Balupg](https://github.com/balupg))
- Individual gizmos can now be enabled/disabled ([Balupg](https://github.com/balupg))
- Unify preparation of instance attributes. Added `MaterialHelper.PushAttributesForInstances` ([MarkusBillharz](https://github.com/MarkusBillharz))
- Added support for PBR [irradiance map](https://doc.babylonjs.com/how_to/physically_based_rendering_master#irradiance-map)
- Ability to set render camera on utility layer instead of using the latest active camera ([TrevorDev](https://github.com/TrevorDev))
- Move normalizeToUnitCube to transformNode instead of abstract mesh and add predicate to exclude sub objects when scaling ([TrevorDev](https://github.com/TrevorDev))
- Method to check if device orientation is available ([TrevorDev](https://github.com/TrevorDev))
- Added support for sound sprites [Doc](https://doc.babylonjs.com/how_to/playing_sounds_and_music#playing-a-sound-sprite) ([Deltakosh](https://github.com/deltakosh/))
- Display Oculus Quest controller when using a Quest in WebVR ([TrevorDev](https://github.com/TrevorDev))
- Added startAndReleaseDragOnPointerEvents property to pointerDragBehavior which can be set to false for custom drag triggering ([TrevorDev](https://github.com/TrevorDev))
- Effect renderer to render one or multiple shader effects to a texture ([TrevorDev](https://github.com/TrevorDev))
- Added url parameters to web request modifiers ([PierreLeBlond](https://github.com/PierreLeBlond))
- Added `VRExperienceHelper.exitVROnDoubleTap` ([Deltakosh](https://github.com/deltakosh/))
- Added `Scene.getTextureByUniqueID` ([aWeirdo](https://github.com/aWeirdo/))
- Added support for 180 VR videos in `VideoDome` ([RaananW](https://github.com/RaananW/))
- Added optional parameter to use Euler angles in planeRotationGizmo ([CedricGuillemet](https://github.com/CedricGuillemet))

### Engine
- Morph targets now can morph UV channel as well ([Deltakosh](https://github.com/deltakosh/))
- Added MorphTarget support to the DepthRenderer, GeometryBufferRenderer and OutlineRenderer ([MarkusBillharz](https://github.com/MarkusBillharz))
- Added preprocessors for shaders to improve how shaders are compiled for WebGL1/2 or WebGPU ([Deltakosh](https://github.com/deltakosh/))
- Added enterPointerlock and exitPointerlock (Separated from enterFullscreen) ([aWeirdo](https://github.com/aWeirdo/))

### Inspector
- Added support for Euler edition only for angles (can be turned off in the new inspector settings) ([Deltakosh](https://github.com/deltakosh/))
- Added an option to ignore backfaces for picking (can be turned on and off in the new inspector settings) ([Deltakosh](https://github.com/deltakosh/))
- Added support for `ShadowGenerator` ([Deltakosh](https://github.com/deltakosh/))
- Added support for scene normalization ([Deltakosh](https://github.com/deltakosh/))
- Added support for morph targets ([Deltakosh](https://github.com/deltakosh/))
- Added context menu to add `SSAORenderingPipeline` and `SSAO2RenderingPipeline` ([Deltakosh](https://github.com/deltakosh/))
- Added support for texture creation and assignments per material ([Deltakosh](https://github.com/deltakosh/))
- Added support for occlusion properties ([Deltakosh](https://github.com/deltakosh/))
- Texture channels are now displayed in grayscale ([Deltakosh](https://github.com/deltakosh/))
- Ambiant and metallic maps are displayed correctly on PBR material even when using ORM packed texture ([Deltakosh](https://github.com/deltakosh/))
- Added support for inspectable strings ([Deltakosh](https://github.com/deltakosh/))

### Tools
- Added `Tools.CreateScreenshotAsync` and `Tools.CreateScreenshotUsingRenderTargetAsync` ([mehmetoguzderin](https://github.com/mehmetoguzderin/))
- Added `Color3.toHSV()`, `Color3.toHSVToRef()` and `Color3.HSVtoRGBToRef()` ([Deltakosh](https://github.com/deltakosh/))
- Added `ShadowGenerator.onAfterShadowMapRenderObservable` and `ShadowGenerator.onAfterShadowMapMeshRenderObservable` ([Deltakosh](https://github.com/deltakosh/))
- Added support for side by side and top bottom images in the `PhotoDome` ([Deltakosh](https://github.com/deltakosh/))
- Added playground ts-local (TypeScript support for local playground) ([pjoe](https://github.com/pjoe/))

### Meshes
- Added new CreateTiledPlane and CreateTiledBox ([JohnK](https://github.com/BabylonJSGuide/))
- Added absolute scaling and rotation getters ([haroldma](https://github.com/haroldma))
- Added `BILLBOARDMODE_USE_POSITION` flag to billboards allowing use of camera positioning instead of orientation for mesh rotation ([delaneyj](https://github.com/delaneyj))

### Physics
- Update Ammo.js library to support global collision contact callbacks ([MackeyK24](https://github.com/MackeyK24/))
- Update Ammo.js library to allow native capsule shape impostors ([MackeyK24](https://github.com/MackeyK24/))
- Update Ammo.js library to allow your own broadphase overlapping pair cache ([MackeyK24](https://github.com/MackeyK24/))
- Update Ammo.js library and AmmoJS plugin to support ellipsoid ([CedricGuillemet](https://github.com/CedricGuillemet/))

### Loaders
- Added support for non-float accessors in animation data for glTF loader. ([bghgary](https://github.com/bghgary))
- Support loading cube data in the .basis loader ([TrevorDev](https://github.com/TrevorDev))
- Load glTF extras into BJS metadata ([pjoe](https://github.com/pjoe))

### Materials
- Added `ShaderMaterial.setColor4Array` ([JonathanTron](https://github.com/JonathanTron/))
- Added `ShaderMaterial.setArray4` ([JonathanTron](https://github.com/JonathanTron/))
- Added `scene.environmentIntensity` to control the IBL strength overall in a scene ([Sebavan](https://github.com/sebavan/))

### ScreenshotTools
- Added interface for argument `size` of screenshot methods ([Dok11](https://github.com/Dok11/))
- Implementation usage of precision in combination height and width params ([Dok11](https://github.com/Dok11/))

### Sounds
- Added `ISoundOptions.skipCodecCheck` to make `Sound` more flexible with URLs ([nbduke](https://github.com/nbduke))

### Ray
- Added `Ray.intersectsAxis` to translate screen to axis coordinates without checking collisions ([horusscope](https://github.com/horusscope))

### GUI
- Added `disableMobilePrompt` option to InputText for OculusQuest(and other android base VR devices) ([shinyoshiaki](https://github.com/shinyoshiaki))
- Added `Button.delegatePickingToChildren` to let buttons delegate hit testing to embedded controls ([Deltakosh](https://github.com/deltakosh/))

### Documentation
- Added a note on shallow bounding of getBoundingInfo ([tibotiber](https://github.com/tibotiber))

## Bug fixes
- Fixed Textblock line spacing evaluation when linespacing > 0 ([Deltakosh](https://github.com/deltakosh/))
- Fixed Xbox One gamepad controller button schemes ([MackeyK24](https://github.com/MackeyK24/))
- Added support for `AnimationGroup` serialization ([Drigax](https://github.com/drigax/))
- Removing assetContainer from scene will also remove gui layers ([TrevorDev](https://github.com/TrevorDev))
- A scene's input manager not adding key listeners when the canvas is already focused ([Poolminer](https://github.com/Poolminer))
- Runtime animation `goToFrame` when going back in time now correctly triggers future events when reached ([zakhenry](https://github.com/zakhenry))
- Fixed bug in Ray.intersectsTriangle where the barycentric coordinates `bu` and `bv` being returned is actually `bv` and `bw`. ([bghgary](https://github.com/bghgary))
- Do not call onError when creating a texture when falling back to another loader ([TrevorDev](https://github.com/TrevorDev))
- Context loss should not cause PBR materials to render black or instances to stop rendering ([TrevorDev](https://github.com/TrevorDev))
- Only cast pointer ray input when pointer is locked in webVR ([TrevorDev](https://github.com/TrevorDev))
- Avoid using default utility layer in gizmo manager to support multiple scenes ([TrevorDev](https://github.com/TrevorDev))
- Fix bug when adding and removing observers in quick succession ([sable](https://github.com/thscott))
- Cannon and Ammo forceUpdate will no longer cause an unexpected exception ([TrevorDev](https://github.com/TrevorDev))
- Loading the same multi-material twice and disposing one should not impact the other ([TrevorDev](https://github.com/TrevorDev))
- GLTF exporter should no longer duplicate exported texture data ([Drigax](https://github.com/Drigax))
- Avoid exception when disposing of Ammo cloth physics ([TrevorDev](https://github.com/TrevorDev))
- Make planeDragGizmo usable on its own ([TrevorDev](https://github.com/TrevorDev))
- Fix useObjectOrienationForDragging for pointerDragBehavior when using a single axis drag ([TrevorDev](https://github.com/TrevorDev))
- Fix VR button not positioning correctly in canvas ([haroldma](https://github.com/haroldma))
- Fix check for material needing alpha blending in OutlineRenderer ([mkmc](https://github.com/mkmc))
- Fixed: scene's input manager's detachControl doesn't remove a wheel event listener ([RamilKadyrov](https://github.com/RamilKadyrov))

## Breaking changes
- Setting mesh.scaling to a new vector will no longer automatically call forceUpdate (this should be done manually when needed) ([TrevorDev](https://github.com/TrevorDev))
- `Tools.ExtractMinAndMaxIndexed` and `Tools.ExtractMinAndMax` are now ambiant functions (available on `BABYLON.extractMinAndMaxIndexed` and `BABYLON.extractMinAndMax`) ([Deltakosh](https://github.com/deltakosh/))
- `Tools.QueueNewFrame` was removed in favor of `Engine.QueueNewFrame` ([Deltakosh](https://github.com/deltakosh/))
