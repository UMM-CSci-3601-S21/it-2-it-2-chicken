package umm3601;
import java.util.Arrays;
import com.mongodb.MongoClientSettings;
import com.mongodb.ServerAddress;
import com.mongodb.client.MongoClient;
import com.mongodb.client.MongoClients;
import com.mongodb.client.MongoDatabase;
import io.javalin.Javalin;
import io.javalin.core.util.RouteOverviewPlugin;
import umm3601.wordRiver.WordRiverController;

public class Server {

  static String appName = "Word River";

  public static void main(String[] args) {

    // Get the MongoDB address and database name from environment variables and
    // if they aren't set, use the defaults of "localhost" and "dev".
    String mongoAddr = System.getenv().getOrDefault("MONGO_ADDR", "localhost");
    String databaseName = System.getenv().getOrDefault("MONGO_DB", "dev");

    // Setup the MongoDB client object with the information we set earlier
    MongoClient mongoClient
      = MongoClients.create(MongoClientSettings
        .builder()
        .applyToClusterSettings(builder -> builder.hosts(Arrays.asList(new ServerAddress(mongoAddr))))
        .build());

    // Get the database
    MongoDatabase database = mongoClient.getDatabase(databaseName);

    // Initialize dependencies
    WordRiverController wordRiverController = new WordRiverController(database);

    Javalin server = Javalin.create(config -> {
      config.registerPlugin(new RouteOverviewPlugin("/api"));
    });
    /*
     * We want to shut the `mongoClient` down if the server either
     * fails to start, or when it's shutting down for whatever reason.
     * Since the mongClient needs to be available throughout the
     * life of the server, the only way to do this is to wait for
     * these events and close it then.
     */
    server.events(event -> {
      event.serverStartFailed(mongoClient::close);
      event.serverStopped(mongoClient::close);
    });
    Runtime.getRuntime().addShutdownHook(new Thread(() -> {
      server.stop();
    }));

    server.start(4567);

    // Get Context Packs
    server.get("/api/packs", wordRiverController::getPacks);

    // Get a single Context Pack
    server.get("/api/packs/:id", wordRiverController::getPack);

    // Adds a new Context Pack
    server.post("/api/packs", wordRiverController::addNewContextPack);

    // Adds a new Word List
    server.post("/api/packs/:id", wordRiverController::addNewWordList);

    // Edits a Word List
    server.put("/api/packs/:id/:name", wordRiverController::editWordList);

    server.get("/api/packs/:id/wordlists", wordRiverController::getWordLists);

    server.get("/api/packs/:id/:name", wordRiverController::getWordList);



    // Edits a Context Pack (implement last)


    // Deletes a Word List
    server.delete("/api/packs/:id/:name", wordRiverController::deleteWordList);

    // Deletes a Context Pack
    server.delete("/api/packs/:id", wordRiverController::deleteContextPack);


    server.exception(Exception.class, (e, ctx) -> {
      ctx.status(500);
      ctx.json(e);
    });
  }
}
